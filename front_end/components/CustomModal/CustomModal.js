
import React from 'react';

class CustomModal extends React.Component {
  handleRemove = () => this.props.onRemove();

  handleSave = () => {
      const { value } = this.course;
      this.props.onSave({
          value,
      });
  }

  renderText() {
      const { start, end } = this.props;

      if (start.isSame(end, 'day')) {
          return (<span>{`${start.format('dddd, HH:mm')} - ${end.format('HH:mm')}`}</span>);
      }
      return (<span>{`${start.format('dddd')} - ${end.format('dddd')}, ${start.format('HH:mm')} - ${end.format('HH:mm')}`}</span>);
  }

  render() {
      const {
          course,
      } = this.props;

      return (
          <div className="customModal">
              <div className="customModal__text">{this.renderText()}</div>
              <input
                  ref={(el) => { this.course = el; } }
                  className="customModal__input"
                  type="text"
                  placeholder="Course"
                  defaultValue={course}
              />
              <button className="customModal__button" onClick = {this.handleRemove}>Delete</button>
              <button className="customModal__button customModal__button_float_right" onClick={this.handleSave}>Save</button>
          </div>
      );
  }
}

export default CustomModal;
