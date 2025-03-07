import { Card, Col, Row, Table } from 'antd';
import { Calendar } from 'react-calendar';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend as BarLegend } from 'recharts';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import 'react-calendar/dist/Calendar.css';
import WorldMap from './components/WorldMap';
import './components/Dashboard.css'; // Importing the new CSS file

const Dashboard = () => {
  // Data for various charts and tables
  const browserData = [
    { name: 'Chrome', value: 4365 },
    { name: 'Firefox', value: 3801 },
    { name: 'IE', value: 1345 },
  ];

  const salesData = [
    { name: 'January', sales: 40 },
    { name: 'February', sales: 60 },
    { name: 'March', sales: 80 },
    { name: 'April', sales: 70 },
    { name: 'May', sales: 50 },
    { name: 'June', sales: 60 },
    { name: 'July', sales: 55 },
    { name: 'August', sales: 40 },
    { name: 'September', sales: 75 },
    { name: 'October', sales: 85 },
    { name: 'November', sales: 90 },
    { name: 'December', sales: 80 },
  ];

  const recentMovementData = [
    { month: 'January', value: 1000 },
    { month: 'February', value: 3000 },
    { month: 'March', value: 2000 },
    { month: 'April', value: 4000 },
    { month: 'May', value: 3500 },
    { month: 'June', value: 5000 },
    { month: 'July', value: 4500 },
    { month: 'August', value: 3000 },
    { month: 'September', value: 4000 },
    { month: 'October', value: 5000 },
    { month: 'November', value: 4500 },
    { month: 'December', value: 4000 },
  ];

  const latestProjectsColumns = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let statusClass = '';
        if (status === 'Done') {
          statusClass = 'status-done';
        } else if (status === 'Cancelled') {
          statusClass = 'status-cancelled';
        } else if (status === 'In progress') {
          statusClass = 'status-in-progress';
        }
        
        return (
          <span
            className={`status-button ${statusClass}`}
            style={{
              display: 'inline-block',
              height: '20px', // Reduced height
              lineHeight: '20px', // Ensure text is centered vertically
              fontSize: '10px', // Reduce font size
              padding: '0 6px', // Adjust padding to fit the content
              textAlign: 'center',
              borderRadius: '3px',
            }}
          >
            {status}
          </span>
        );
      },
      width: 150, // Ensure enough width for the status column
      minWidth: 150,
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
    },
  ];
  
  const latestProjectsData = [
    { name: 'Project Apollo', startDate: '01/01/2023', endDate: '31/06/2023', status: 'Done', assignee: 'Vanessa Tucker' },
    { name: 'Project Fireball', startDate: '01/01/2023', endDate: '31/06/2023', status: 'Cancelled', assignee: 'William Harris' },
    { name: 'Project Hades', startDate: '01/01/2023', endDate: '31/06/2023', status: 'Done', assignee: 'Sharon Lessman' },
    { name: 'Project Nitro', startDate: '01/01/2023', endDate: '31/06/2023', status: 'In progress', assignee: 'Vanessa Tucker' },
    { name: 'Project sam', startDate: '01/01/2023', endDate: '31/06/2023', status: 'Done', assignee: 'William Harris' },
    { name: 'Project Phoenix', startDate: '01/01/2023', endDate: '31/06/2023', status: 'Done', assignee: 'William Harris' },
    { name: 'Project Phoenix', startDate: '01/01/2023', endDate: '31/06/2023', status: 'Done', assignee: 'William Harris' },
  ];
  

  return (
    <div className="container mt-4">
    

      {/* Row 1: Recent Movement (50% of screen width) */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={12}>
          <Card title="Recent Movement" style={{ height: '100%' }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={recentMovementData}>
                <XAxis dataKey="month" />
                <YAxis domain={[1000, 5000]} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#1F325C" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Row 2: Calendar (small) - World Map - Pie Chart */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={8} md={8}>
          <Card title="Calendar" style={{ height: '100%' }}>
            <Calendar />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={8}>
          <Card title="Real-Time" style={{ height: '100%' }}>
            <div style={{ height: '300px', width: '100%' }}>
              <WorldMap />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8} md={8}>
          <Card title="Browser Usage" style={{ height: '100%' }}>
            <PieChart width={350} height={300}>
              <Pie data={browserData} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8" label>
                {browserData.map((browser, index) => (
                  <Cell key={`cell-${index}`} fill={['#1F325C', '#82ca9d', '#ff7300'][index % 3]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Card>
        </Col>
      </Row>

      {/* Row 3: Latest Projects (Rectangle) & Monthly Sales (Same height as Latest Projects) */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
      <Col xs={24} sm={12} md={12} id="latest-projects-col">
        <Card title="Latest Projects" style={{ height: 'auto' }}>
          <Table columns={latestProjectsColumns} dataSource={latestProjectsData} rowKey="name" pagination={false} />
        </Card>
      </Col>
        <Col xs={24} sm={12} md={12}>
          <Card title="Monthly Sales" style={{ height: '100%' }}>
            <BarChart width={600} height={590} data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="sales" fill="#1F325C" />
              <BarTooltip />
              <BarLegend />
            </BarChart>
          </Card>
        </Col>
      </Row>

      {/* Footer */}
      <footer className="mt-4 text-center text-muted">
        <p>Copyright © 2024 by Skarvi Systems Limited</p>
      </footer>
    </div>
  );
};

export default Dashboard;
