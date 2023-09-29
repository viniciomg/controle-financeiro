import React, { useState } from 'react';
import { Row, Col, Card, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importe o CSS do react-calendar
import { useNavigate } from 'react-router-dom';

import 'moment/locale/pt-br';

moment.locale('pt-br'); 

const YearMonthSelector = () => {

  const navigate = useNavigate(); 

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(null);

  const handleYearChange = (step) => {
    setSelectedYear(selectedYear + step);
    setSelectedMonth(null);
  };

  const handleCalendarClick = (year, month) => {
    // Navegar para a próxima página com os parâmetros de ano e mês
    navigate(`/AppLancar/${year}/${month}`);
  };

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <Button
            type="primary"
            shape="circle"
            icon={<LeftOutlined />}
            onClick={() => handleYearChange(-1)}
          />
        </Col>
        <Col>
          <h2>{selectedYear}</h2>
        </Col>
        <Col>
          <Button
            type="primary"
            shape="circle"
            icon={<RightOutlined />}
            onClick={() => handleYearChange(1)}
          />
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        {Array.from({ length: 12 }, (_, index) => {
          const month = index + 1;
          const calendarDate = new Date(selectedYear, index, 1);
          return (
            <Col   xs={24} sm={12} md={8} lg={6} key={month}>
              <Card
               onClick={() => handleCalendarClick(selectedYear, month)}
                hoverable
                className={selectedMonth === month ? 'selected' : ''}
                style={{ cursor: 'pointer' }}
              >
                <h3>{moment(calendarDate).format('MMMM')}</h3>
                <div className="ant-calendar">
                  <div className="ant-calendar-content">
                    <div className="ant-calendar-header">
                      <div className="ant-calendar-title">
                        {moment(calendarDate).format('MMMM YYYY')}
                      </div>
                    </div>
                    <div className="ant-calendar-body">
                      <Calendar value={calendarDate} />
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default YearMonthSelector;
