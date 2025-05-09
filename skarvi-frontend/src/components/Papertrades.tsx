import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaperTradesTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);  
  const [error, setError] = useState<string | null>(null); // Corrected line
  const API_BASE_URL = 'http://127.0.0.1:8000';
  const accessToken = localStorage.getItem("access_token");

  // Redirect to login page if no access token is found
  useEffect(() => {
    if (!accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  // Fetch data when component mounts
    useEffect(() => {
      const fetchTrades = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/paper_trades/hedging/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`, 
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 401) {
            // Token invalid or expired
            localStorage.removeItem("access_token"); // Optional: clear invalid token
            navigate('/'); // Redirect to login page
            return;
          }

          if (response.ok) {
            const data = await response.json();
            setTrades(data); 
          } else {
            const errorData = await response.json();
            console.error("Fetch error:", errorData);
            setError("Failed to fetch trades.");
          }
        } catch (error) {
          console.error("Error fetching trades:", error);
          setError("An error occurred while fetching trades.");
        }
      };

      fetchTrades();
    }, [accessToken, navigate]);


  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this trade?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/paper_trades/hedging/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`, 
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 204) {
        alert('Trade deleted successfully!');
        setTrades(trades.filter((trade) => trade.id !== id)); 
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to delete trade'}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the trade.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    console.log('Uploading file:', uploadedFile);
    setShowModal(false);
  };

  return (
    <>
      <style>
        {`
          html, body, #root {
            height: 100%;
            margin: 0;
          }

          .page-wrapper {
            min-height: 100%;
            display: flex;
            flex-direction: column;
          }

          .container {
            flex: 1;
            padding: 20px;
            font-family: Arial, sans-serif;
          }

          .header {
            font-size: 20px;
            font-weight: bold;
            background: #f5f5f5;
            padding: 10px 20px;
            display: inline-block;
            border-radius: 5px;
            margin-bottom: 20px;
          }

          .header span {
            color: #1F325C;
          }

          .button-group {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 20px;
          }

          .main-button {
            background-color: #1F325C;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .main-button:hover {
            opacity: 0.9;
          }

          .trade-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }

          .trade-table th,
          .trade-table td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: center;
          }

          .trade-table th {
            background-color: #f9f9f9;
            font-weight: bold;
            position: relative;
          }

          .trade-table th .filter-icon {
            font-size: 12px;
            margin-left: 5px;
            color: #999;
          }

          .trade-table input[type="checkbox"] {
            margin-right: 5px;
          }

          .action-button {
            background-color: #1F325C;
            color: white;
            border: none;
            padding: 6px 12px;
            margin: 0 2px 5px;
            border-radius: 4px;
            font-size: 13px;
            cursor: pointer;   
            display: inline;        
          }

          .action-button:hover {
            opacity: 0.9;
          }

          .footer {
            background: #f5f5f5;
            padding: 15px 10px;
            text-align: center;
            font-size: 12px;
            color: #555;
          }

          .footer a {
            color: #1F325C;
            text-decoration: none;
          }

          .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999;
          }

          .upload-modal {
            background: white;
            padding: 40px 30px;
            border-radius: 12px;
            width: 500px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            position: relative;
            text-align: center;
          }

          .modal-close-icon {
            position: absolute;
            top: 12px;
            right: 16px;
            font-size: 20px;
            cursor: pointer;
            color: #999;
          }

          .upload-header {
            margin-top: 0;
            margin-bottom: 30px;
            font-size: 24px;
            color: #1F325C;
            font-weight: bold;
          }

          .upload-box {
            background: #f9f9f9;
            padding: 25px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: left;
          }

          .upload-box label {
            font-weight: bold;
            display: block;
            margin-bottom: 15px;
          }

          .file-input-row {
            background-color: #f0f8ff;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            color: #555;
          }

          .choose-file-btn {
            background-color: #e6eaf3;
            color: #1f325c;
            padding: 8px 15px;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
          }

          .file-input-row input[type="file"] {
            display: none;
          }

          .upload-submit-btn {
            background-color: #1F325C;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 6px;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
          }

          .upload-submit-btn:hover {
            background-color: #162747;
          }
        `}
      </style>

      <div className="page-wrapper">
        <div className="container">
          <h2 className="header">
             Trades &gt; <span>Paper Trades</span>
          </h2>

          <div className="button-group">
            <button className="main-button" onClick={() => navigate('/add-new-trade')}>
              <span>➕</span> Add Trade
            </button>
            <button className="main-button"><span>🔍</span> Search Trade</button>
            <button className="main-button" onClick={() => setShowModal(true)}><span>📤</span> Upload Excel</button>
            <button className="main-button"><span>📋</span> Copy Trade</button>
            <button className="main-button"><span>⤴</span> Upload Trade</button>
          </div>

          <table className="trade-table">
            <thead>
              <tr>
                <th>Unique Ref <span className="filter-icon">⚲</span></th>
                <th>Trans Ref <span className="filter-icon">⚲</span></th>
                <th>Trade <span className="filter-icon">⚲</span></th>
                <th>Trade On <span className="filter-icon">⚲</span></th>
                <th>Pricing Basis <span className="filter-icon">⚲</span></th>
                <th>Pricing Period <span className="filter-icon">⚲</span></th>
                <th>Broker <span className="filter-icon">⚲</span></th>
                <th>Quantity <span className="filter-icon">⚲</span></th>
                <th>Fixed Price <span className="filter-icon">⚲</span></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(trades) && trades.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.tran_ref_no}</td>
                  <td>{item.transaction_type}</td>
                  <td>{item.traded_on}</td>
                  <td>{item.Pricing}</td>
                  <td>{item.pricing_period_from}</td>
                  <td>{item.broker_name}</td>
                  <td>{item.quantity_mt}</td>
                  <td>{item.fixed_price}</td>
                  <td>
                    <button className="action-button">View</button>
                    <button className="action-button" onClick={() => navigate('/hedging-trades-detail')}>
                      <span></span> Edit
                    </button>
                    <button
                      className="action-button"
                      onClick={() => handleDelete(item.id)} 
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="footer">
          Copyright © 2019 <a href="#">Skarvi Systems</a>. All rights reserved.
        </footer>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="upload-modal">
            <div className="modal-close-icon" onClick={() => setShowModal(false)}>×</div>
            <h2 className="upload-header">Upload File</h2>

            <div className="upload-box">
              <label>Upload Xlsx/Xlsb</label>
              <div className="file-input-row">
                <label className="choose-file-btn" htmlFor="fileInput">Choose File</label>
                <span>{uploadedFile ? uploadedFile.name : 'No File Chosen'}</span>
                <input id="fileInput" type="file" accept=".xlsx,.xlsb" onChange={handleFileChange} />
              </div>
            </div>

            <button className="upload-submit-btn" onClick={handleSubmit}>Upload</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PaperTradesTable;
