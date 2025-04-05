import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Label
} from 'recharts';
import { ImStatsBars } from "react-icons/im";


const HrHome = () => {
  const [metrics, setMetrics] = useState([]);
  const [hoursMetrics, setHoursMetrics] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    const fetchMetrics = async () => {
      try {
        const [projectRes, hoursRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/employee-projects/metrics', {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }),
          axios.get('http://127.0.0.1:8000/api/attendances/metrics', {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          })
        ]);

        setMetrics(projectRes.data);
        setHoursMetrics(hoursRes.data);
      } catch (err) {
        console.error('Greška pri dohvatanju metrika:', err);
        if (err.response?.status === 403) {
          setError('Nemate ovlašćenja za pristup ovoj stranici.');
        } else {
          setError('Došlo je do greške.');
        }
      }
    };

    fetchMetrics();
  }, []);

  if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '40px' }}>{error}</p>;

  return (
    <div className="hr-home">
      <h1> <ImStatsBars/> Dashboard - Metrike Zaposlenih <ImStatsBars/> </h1>

      {/* Sekcija 1: Projekti */}
      <section className="chart-section">
        <h2 className="chart-title">Broj Projekata po Zaposlenom</h2>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" minWidth={800} height={500}>
            <BarChart
              data={metrics}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-25}
                textAnchor="end"
                interval={0}
                height={100}
              >
                <Label value="Zaposleni" offset={-60} position="insideBottom" />
              </XAxis>
              <YAxis allowDataOverflow={true} domain={[0, 'dataMax + 2']}>
                <Label
                  value="Broj Projekata"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: 'middle' }}
                />
              </YAxis>
              <Tooltip />
              <Legend />
              <Bar dataKey="project_count" fill="#b667c2" name="Broj Projekata" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Sekcija 2: Sati Rada */}
      <section className="chart-section">
        <h2 className="chart-title">Top 10 Zaposlenih po Broju Radnih Sati</h2>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={500} minWidth={800}>
            <BarChart
              data={hoursMetrics}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-25}
                textAnchor="end"
                interval={0}
                height={100}
              >
                <Label value="Zaposleni" offset={-60} position="insideBottom" />
              </XAxis>
              <YAxis allowDataOverflow={true} domain={[0, 'dataMax + 10']}>
                <Label
                  value="Sati Rada"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: 'middle' }}
                />
              </YAxis>
              <Tooltip />
              <Legend />
              <Bar dataKey="total_hours" fill="#a46ccf" name="Radni Sati" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default HrHome;
