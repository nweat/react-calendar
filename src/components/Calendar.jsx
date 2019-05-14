import React from "react";
import dateFns from "date-fns";

const defaultCalendarModes = ['Month', 'Week']

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    currentWeek: new Date(),
    selectedDate: new Date(),
    calendarMode: defaultCalendarModes[0]
  };

  renderModeOptions() {
    return (
        <div className="header row flex-middle">
          <button onClick = {() => this.setCalendarMode(defaultCalendarModes[0])}>Month</button>
          <button onClick = {() => this.setCalendarMode(defaultCalendarModes[1])}>Week</button>
        </div>
    )
  }

  renderHeader() {
    const dateFormat = "MMMM YYYY";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  renderHeaderWeekMode() {
    //get current week that current day falls in DONE
    //if forward:
    // add 7 days to last day of current week
    //
    // if previous:
    // subtract 7 days from first day of current week
    const weekFormat = "dddd D"
    const weekModeHeadingFormat = "MMM YYYY"
    const days = []

    let startDate = dateFns.startOfWeek(this.state.currentWeek);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), weekFormat)}
        </div>
      );
    }

    return (
      <div className="header row flex-middle">

        <div className="col col-start">
          <div className="icon" onClick={this.prevWeek}>chevron_left</div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentWeek, weekModeHeadingFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextWeek}>
          <div className="icon">chevron_right</div>
        </div>
        <div className="days row">{days}</div>

      </div>
    )
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
            }`}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  setCalendarMode = mode => {
    this.setState({
      calendarMode: mode
    })
  }

  onDateClick = day => {
    this.setState({
      selectedDate: day
    });
  };

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  nextWeek = () => {
    this.setState({
      currentWeek: dateFns.addDays(this.state.currentWeek, 7)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };

  prevWeek = () => {
    this.setState({
      currentWeek: dateFns.subDays(this.state.currentWeek, 7)
    });
  };

  render() {
    const { calendarMode } = this.state
    return (
      <div className="calendar">
        {this.renderModeOptions()}
        {calendarMode === defaultCalendarModes[0] && this.renderHeader()}
        {calendarMode === defaultCalendarModes[0] && this.renderDays()}
        {calendarMode === defaultCalendarModes[0] && this.renderCells()}

        {calendarMode === defaultCalendarModes[1] && this.renderHeaderWeekMode()}
      </div>
    );
  }
}

export default Calendar;
