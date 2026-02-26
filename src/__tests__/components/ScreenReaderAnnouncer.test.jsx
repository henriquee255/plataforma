/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScreenReaderAnnouncer from '../../components/ScreenReaderAnnouncer';

describe('ScreenReaderAnnouncer Component', () => {
  it('should not render when message is empty', () => {
    const { container } = render(<ScreenReaderAnnouncer message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render message with default props', () => {
    render(<ScreenReaderAnnouncer message="Test announcement" />);
    const announcer = screen.getByText('Test announcement');

    expect(announcer).toBeInTheDocument();
    expect(announcer).toHaveAttribute('role', 'status');
    expect(announcer).toHaveAttribute('aria-live', 'polite');
    expect(announcer).toHaveAttribute('aria-atomic', 'true');
  });

  it('should render with assertive priority', () => {
    render(
      <ScreenReaderAnnouncer
        message="Urgent message"
        priority="assertive"
      />
    );
    const announcer = screen.getByText('Urgent message');

    expect(announcer).toHaveAttribute('aria-live', 'assertive');
  });

  it('should render with alert role', () => {
    render(
      <ScreenReaderAnnouncer
        message="Alert message"
        role="alert"
      />
    );
    const announcer = screen.getByText('Alert message');

    expect(announcer).toHaveAttribute('role', 'alert');
  });

  it('should have sr-only class for screen reader only content', () => {
    render(<ScreenReaderAnnouncer message="Hidden message" />);
    const announcer = screen.getByText('Hidden message');

    expect(announcer).toHaveClass('sr-only');
  });
});
