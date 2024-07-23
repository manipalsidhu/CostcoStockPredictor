import os
import io
import json
import base64
import numpy as np
import pandas as pd
import tensorflow as tf
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class AIModel():
    def __init__(self):
        model_path = os.path.join(os.path.dirname(__file__), 'final-model.h5')
        self.model = tf.keras.models.load_model(model_path, compile=False)
        url = "https://raw.githubusercontent.com/vikastrivedi0/StockPricePrediction-Costco-LSTM/main/Costco-Stock-Prices-Datset.csv"
        self.df = pd.read_csv(url)
        self.df['Date'] = pd.to_datetime(self.df['Date']).dt.date
        self.df.set_index('Date', inplace=True)
        self.dataset = self.df[['Open', 'High', 'Low', 'Close']].values
        self.dataset = self.dataset.astype('float32')
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.dataset = self.scaler.fit_transform(self.dataset)
        self.look_back = 20

    def get_model_summary(self):
        string_list = []
        self.model.summary(line_length=80, print_fn=lambda x: string_list.append(x))
        summary_json = "\n".join(string_list)
        result = {"output": summary_json}
        return result

    def predict(self, prediction_days=7):
        new_days = prediction_days
        last_known_data = self.dataset[-self.look_back:]
        predictions = []
        last_date = self.df.index[-1]
        next_dates = pd.date_range(start=last_date, periods=new_days+1, freq='B')[1:]

        for _ in range(new_days):
            prediction = self.model.predict(last_known_data.reshape(1, self.look_back, 4))
            predictions.append(prediction[0][0])
            new_data_point = np.array([last_known_data[0, 1], last_known_data[0, 2], last_known_data[0, 3], prediction[0][0]]).reshape(1, 4)
            last_known_data = np.append(last_known_data[1:], new_data_point, axis=0)

        next_n_days_predictions = self.scaler.inverse_transform(np.c_[predictions, np.zeros(len(predictions)), np.zeros(len(predictions)), np.zeros(len(predictions))])[:, 0]
        predictions_with_dates = list(zip(next_dates, next_n_days_predictions))

        prediction_list = []
        for date, prediction in predictions_with_dates:
            prediction_dict = {"date": str(date.date()), "prediction": prediction}
            prediction_list.append(prediction_dict)
    
        plot_image_bytes = io.BytesIO()
        plt.figure(figsize=(15, 6))
        baseline_close = self.scaler.inverse_transform(self.dataset)[:, 3]
        dates = pd.date_range(start=self.df.index[0], periods=len(baseline_close), freq='B')
        plt.plot(dates, baseline_close, label='Actual Data')
        future_dates = pd.date_range(start=dates[-1], periods=new_days+1, freq='B')[1:]
        plt.plot(future_dates, next_n_days_predictions, label='Predicted Data', linestyle='--')
        plt.title('Stock Price Prediction with LSTM')
        plt.xlabel('Date')
        plt.ylabel('Stock Price')
        plt.legend()
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig(plot_image_bytes, format='png', bbox_inches="tight")
        plt.close()
        plot_image_bytes_b64 = base64.b64encode(plot_image_bytes.getvalue()).decode("utf-8").replace("\n", "")

        result = {
            "output": prediction_list,
            "image": plot_image_bytes_b64
        }
        
        return result

@app.route('/api/get_predictions', methods=['GET'])
def get_predictions():
    try:
        days = request.args.get('days')
        if not days:
            return jsonify({
                "status": "error",
                "msg": "You need to pass the 'days' variable to predict the new n days.",
                "model_summary": None,
                "prediction_values": None,
                "prediction_graph": None
            }), 400

        ai_model = AIModel()
        model_summary = ai_model.get_model_summary()
        model_prediction = ai_model.predict(int(days))

        result = {
            "status": "ok",
            "msg": "Excellent Job",
            "model_summary": model_summary["output"],
            "prediction_values": model_prediction["output"],
            "prediction_graph": model_prediction["image"]
        }

        return jsonify(result), 200

    except Exception as e:
        result = {
            "status": "error",
            "msg": f"Something happened. Error: {e}",
            "model_summary": None,
            "prediction_values": None,
            "prediction_graph": None
        }
        return jsonify(result), 400

if __name__ == '__main__':
    app.run(debug=True)
