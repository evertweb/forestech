/**
 * BaseModal.test.js - Tests básicos para BaseModal
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BaseModal from '../BaseModal';
import ModalHeader from '../ModalHeader';
import ModalFooter from '../ModalFooter';

describe('BaseModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Modal content</div>
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal when isOpen is true', () => {
    render(<BaseModal {...defaultProps} />);
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(<BaseModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  test('calls onClose when clicking overlay', () => {
    const onClose = jest.fn();
    render(<BaseModal {...defaultProps} onClose={onClose} />);
    
    const overlay = document.querySelector('.base-modal-overlay');
    fireEvent.click(overlay);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('does not close when preventCloseOnOverlay is true', () => {
    const onClose = jest.fn();
    render(<BaseModal {...defaultProps} onClose={onClose} preventCloseOnOverlay />);
    
    const overlay = document.querySelector('.base-modal-overlay');
    fireEvent.click(overlay);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  test('calls onClose when pressing Escape key', () => {
    const onClose = jest.fn();
    render(<BaseModal {...defaultProps} onClose={onClose} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('applies correct size class', () => {
    render(<BaseModal {...defaultProps} size="lg" />);
    
    const content = document.querySelector('.base-modal-content');
    expect(content).toHaveClass('base-modal-lg');
  });

  test('applies custom className', () => {
    render(<BaseModal {...defaultProps} className="custom-modal" />);
    
    const content = document.querySelector('.base-modal-content');
    expect(content).toHaveClass('custom-modal');
  });
});

describe('ModalHeader', () => {
  test('renders title correctly', () => {
    render(<ModalHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('renders close button by default', () => {
    const onClose = jest.fn();
    render(<ModalHeader title="Test" onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('Cerrar modal');
    expect(closeButton).toBeInTheDocument();
  });

  test('hides close button when showCloseButton is false', () => {
    render(<ModalHeader title="Test" showCloseButton={false} />);
    
    const closeButton = screen.queryByLabelText('Cerrar modal');
    expect(closeButton).not.toBeInTheDocument();
  });

  test('calls onClose when clicking close button', () => {
    const onClose = jest.fn();
    render(<ModalHeader title="Test" onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('Cerrar modal');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('ModalFooter', () => {
  test('renders primary action button', () => {
    const primaryAction = {
      label: 'Save',
      onClick: jest.fn()
    };
    
    render(<ModalFooter primaryAction={primaryAction} />);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('renders secondary action button', () => {
    const secondaryAction = {
      label: 'Cancel',
      onClick: jest.fn()
    };
    
    render(<ModalFooter secondaryAction={secondaryAction} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('shows loading state on primary button', () => {
    const primaryAction = {
      label: 'Save',
      loadingLabel: 'Saving...',
      onClick: jest.fn()
    };
    
    render(<ModalFooter primaryAction={primaryAction} isLoading />);
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });

  test('disables buttons when loading', () => {
    const primaryAction = { label: 'Save', onClick: jest.fn() };
    const secondaryAction = { label: 'Cancel', onClick: jest.fn() };
    
    render(
      <ModalFooter 
        primaryAction={primaryAction} 
        secondaryAction={secondaryAction}
        isLoading 
      />
    );
    
    expect(screen.getByText('Guardando...')).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });
});