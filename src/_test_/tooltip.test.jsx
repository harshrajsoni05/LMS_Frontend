import { fireEvent, render, screen } from '@testing-library/react';
import Tooltip from '../components/toolTip'; 

describe('Tooltip Component', () => {

  test('should render children content', () => {
    render(
      <Tooltip message="This is a tooltip">
        <button>Hover over me</button>
      </Tooltip>
    );
    
    expect(screen.getByText('Hover over me')).toBeInTheDocument();
  });

  test('should render tooltip message', () => {
    render(
      <Tooltip message="This is a tooltip">
        <button>Hover over me</button>
      </Tooltip>
    );

    expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
  });

//   test('tooltip message should be hidden initially (if you have visibility logic)', () => {
//     render(
//       <Tooltip message="This is a tooltip">
//         <button>Hover over me</button>
//       </Tooltip>
//     );

//     const tooltipMessage = screen.getByText('This is a tooltip');
//     expect(tooltipMessage).toHaveClass('tooltip-text');
//     expect(tooltipMessage).toHaveStyle('visibility: hidden'); 
//   });

  test('tooltip should display on hover', () => {
    render(
      <Tooltip message="This is a tooltip">
        <button>Hover over me</button>
      </Tooltip>
    );

    const tooltipMessage = screen.getByText('This is a tooltip');
    const button = screen.getByText('Hover over me');

    fireEvent.mouseOver(button);

    expect(tooltipMessage).toHaveStyle('visibility: visible');
  });

});
