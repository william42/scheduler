import React from 'react';
import './App.css';

function App() {

  var startData = {};
  for (let x of [1,2,3]) {
    startData[x] = false;
  }

  return (
    <div className="App">
      <DateList data={null}/>
    </div>
  );
}

function FormRow(props) {
  return (
    <div className="form-row">
      <label htmlFor={props.name}>
        {props.display}:&nbsp;
      </label>
      <input
        type={props.type}
        id={props.name}
        name={props.name}
        disabled={props.disabled}
        onChange={props.onChange} />
    </div>
  );
}

function DateSelection(props) {
  var data = props.data || {
    date: null,
    startTime: null,
    endTime: null,
  };
  function handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    const newData = {...data, [name]: value};
    props.onChange(newData);
  }
  function handleDelete() {
    const ok = window.confirm("Are you sure you want to delete this appointment?");
    if (ok) {
      props.onDelete();
    }
  }

  var submission = '';
  if (props.focused) {
    if (!props.valid) {
      submission = (
        <div>
          <span role="img" aria-label="Invalid appointment">❌</span> {props.invalidReason}
        </div>
      );
    } else {
      submission = (
        <input
          type="button"
          value="Submit"
          onClick={props.onSubmit}/>
      );
    }
  } else {
    submission = (
      <input
        type="button"
        value="Modify"
        onClick={props.onRefocus}/>
    );
  }

  return (
    <form>
      <FormRow
        display="Date"
        name="date"
        type="date"
        value={data.date}
        disabled={!props.focused}
        onChange={handleChange}/>
      <FormRow
        display="Start Time"
        name="startTime"
        type="time"
        value={data.startTime}
        disabled={!props.focused}
        onChange={handleChange}/>
      <FormRow
        display="End Time"
        name="endTime"
        type="time"
        value={data.endTime}
        disabled={!props.focused}
        onChange={handleChange}/>
      <div className="form-row">
        {submission}
        <input
        type="button"
        value="Delete"
        onClick={handleDelete}/>
      </div>
    </form>
  );
}

class DateList extends React.Component {
  constructor(props) {
    super(props);
    if (props.data) {
      const keys = Object.keys(props.data).map(x => parseInt(x));
      this.state = {
        data: props.data,
        next_id: Math.max(...keys) + 1,
        focus: props.focus || null,
      }
    } else {
      this.state = {
        data: {1: null},
        next_id: 2,
        focus: 1,
      }
    }

    this.addNew = this.addNew.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);
  }

  setInvalid(reason) {
    this.valid = false;
    this.invalidReason = reason;
  }

  checkValidity() {
    const focus = this.state.focus;
    // Big assumption: only edits to the current focus will make anything invalid
    // This should hold, since only the current focus can be edited, and can't be "blurred" without being valid
    // It *is* possible to delete unfocused items, but that can never turn a valid thing invalid
    if (!focus) {
      this.valid = true;
      return;
    }
    const focused_appointment = this.state.data[focus];
    if (!focused_appointment) {
      this.setInvalid('Enter an appointment date and time.');
      return;
    }
    for (let x of ['date', 'startTime', 'endTime']) {
      if (!focused_appointment[x]) {
        this.setInvalid('Enter an appointment date and time.');
        return;
      }
    }
    if (focused_appointment.startTime >= focused_appointment.endTime) {
      this.setInvalid('Appointment must end after it starts.');
      return;
    }
    const now = new Date();
    const start = new Date(focused_appointment.date + " " + focused_appointment.startTime);
    if (now >= start) {
      this.setInvalid('Appointment must be scheduled for after the current time.');
      return;
    }

    for (let key in this.state.data) {
      const other_appointment = this.state.data[key];
      if (parseInt(key) === parseInt(focus)) {
        continue;
      }
      if (focused_appointment.date !== other_appointment.date) {
        continue;
      }
      // The overlap check is a bit of a trick, so I'll explain it a bit here.
      // If one starts after the other ends then it's completely after.
      // If one starts at the same time as the other ends we have an edge case; whether there's overlap is debatable.
      // Otherwise, there's overlap, because appointment A is not completely before and not completely after appointment B.
      if (
        focused_appointment.startTime < other_appointment.endTime &&
        other_appointment.startTime < focused_appointment.endTime
      ) {
        this.setInvalid("This appointment conflicts with another appointment.");
        return;
      }
    }

    this.valid = true;
  }

  handleDataUpdate(id) {
    return (newData) => {
      this.setState((state, props) => {
        const fullNewData = {...state.data, [id]: newData};
        return {data: fullNewData};
      });
    };
  }

  handleRefocus(id) {
    return () => {
      this.setState({focus: id});
    }
  }

  handleDelete(id) {
    return () => {
      this.setState((state, props) => {
        var newData = {...state.data}; // make a copy
        delete newData[id];
        var update = {data: newData};
        if (parseInt(state.focus) === parseInt(id)) {
          update.focus = null;
        }
        return update;
      });
    };
  }

  handleSubmission() {
    this.checkValidity();
    if (this.valid) {
      this.setState({focus: null});
    }
  }

  addNew() {
    console.log(this.state);
    this.setState((state, props) => {
      const next_id = state.next_id;
      const newData = {...state.data, [next_id]: null};
      return {
        data: newData,
        next_id: next_id + 1,
        focus: next_id,
      };
    });
  }

  render() {
    const listHelper = (entry) => {
      const [id, data] = entry;
      return (
        <li key={id}>
          <DateSelection
            data={data}
            onChange={this.handleDataUpdate(id)}
            onSubmit={this.handleSubmission}
            onRefocus={this.handleRefocus(id)}
            onDelete={this.handleDelete(id)}
            focused={parseInt(this.state.focus) === parseInt(id)}
            focusable={this.state.focus === null}
            valid={this.valid}
            invalidReason={this.invalidReason}/>
        </li>
      )
    }

    this.checkValidity();
    const entries = Object.entries(this.state.data).map(listHelper);

    return (
      <ul className="date-list">
        {entries}
        <li key="new">
          <input
            type="button"
            value="Add New"
            onClick={this.addNew}
            disabled = {this.state.focus !== null}
          />
        </li>
      </ul>
    );
  }

}

export default App;
