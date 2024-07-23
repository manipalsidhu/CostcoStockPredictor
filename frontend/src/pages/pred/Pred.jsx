import React, { useState, useEffect } from 'react';
import './Pred.css';

export default function Pred() {
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [predictionValues, setPredictionValues] = useState([]);
  const [predictionGraph, setPredictionGraph] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePeriodChange = async (event) => {
    const period = event.target.value;
    setSelectedPeriod(period);
    setLoading(true);
    await fetchData(period);
    setLoading(false);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('en-CA', {
      style: 'currency',
      currency: 'CAD'
    });
  };

  const fetchData = async (period) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/get_predictions?days=${period}`);
      const data = await response.json();

      if (data.status === 'ok') {
        const formattedPredictions = data.prediction_values.map(prediction => ({
          date: prediction.date,
          prediction: formatCurrency(prediction.prediction)
        }));

        setPredictionValues(formattedPredictions);
        setPredictionGraph(data.prediction_graph);
      } else {
        console.error('API request failed:', data.msg);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (selectedPeriod) {
      handlePeriodChange({ target: { value: selectedPeriod } });
    }
  }, [selectedPeriod]);

  return (
    <div className="pred-content">
      <h1>Stock Prediction</h1>
      <div className="dropdown-container">
        <select
          value={selectedPeriod}
          onChange={handlePeriodChange}
          className="period-dropdown"
        >
          <option value="">Please Select Prediction</option>
          <option value="7">7 Days</option>
          <option value="10">10 Days</option>
          <option value="15">15 Days</option>
          <option value="20">20 Days</option>
          <option value="25">25 Days</option>
          <option value="30">30 Days</option>
          <option value="35">35 Days</option>
          <option value="40">40 Days</option>
        </select>
      </div>
      {loading && <p>Loading...</p>}
      {!loading && selectedPeriod && (
        <>
          {predictionGraph && (
            <div className="graph-container">
              <img src={`data:image/png;base64,${predictionGraph}`} alt="Stock Prediction Graph" />
            </div>
          )}
          {predictionValues.length > 0 && (
            <div className="predictions-table-container">
              <table className="predictions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Prediction</th>
                  </tr>
                </thead>
                <tbody>
                  {predictionValues.map((prediction, index) => (
                    <tr key={index}>
                      <td>{prediction.date}</td>
                      <td>{prediction.prediction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
