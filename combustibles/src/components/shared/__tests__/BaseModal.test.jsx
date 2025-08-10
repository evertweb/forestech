/**
 * Tests para BaseModal component
 * Verifica funcionalidad básica, props, eventos y accesibilidad
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BaseModal from '../BaseModal';

describe('BaseModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div>Modal Content</div>,
  };

  beforeEach(() => {
    // Reset mock functions
    vi.clearAllMocks();
    // Reset body overflow
    document.body.style.overflow = 'unset';
  });

  it('renders correctly when open', () => {
    render(<BaseModal {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<BaseModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<BaseModal {...defaultProps} title="Test Modal" />);

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('renders close button by default', () => {
    render(<BaseModal {...defaultProps} title="Test Modal" />);

    const closeButton = screen.getByRole('button', { name: /cerrar modal/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    render(<BaseModal {...defaultProps} title="Test Modal" showCloseButton={false} />);

    expect(screen.queryByRole('button', { name: /cerrar modal/i })).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<BaseModal {...defaultProps} onClose={onClose} title="Test Modal" />);

    const closeButton = screen.getByRole('button', { name: /cerrar modal/i });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<BaseModal {...defaultProps} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(<BaseModal {...defaultProps} onClose={onClose} />);

    const overlay = screen.getByRole('dialog');
    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when overlay is clicked and preventCloseOnOverlay is true', () => {
    const onClose = vi.fn();
    render(<BaseModal {...defaultProps} onClose={onClose} preventCloseOnOverlay={true} />);

    const overlay = screen.getByRole('dialog');
    fireEvent.click(overlay);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when modal content is clicked', () => {
    const onClose = vi.fn();
    render(<BaseModal {...defaultProps} onClose={onClose} />);

    const content = screen.getByText('Modal Content');
    fireEvent.click(content);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<BaseModal {...defaultProps} size="sm" />);
    expect(screen.getByRole('document')).toHaveClass('max-w-md');

    rerender(<BaseModal {...defaultProps} size="lg" />);
    expect(screen.getByRole('document')).toHaveClass('max-w-4xl');

    rerender(<BaseModal {...defaultProps} size="xl" />);
    expect(screen.getByRole('document')).toHaveClass('max-w-6xl');
  });

  it('applies custom className', () => {
    render(<BaseModal {...defaultProps} className="custom-modal" />);

    expect(screen.getByRole('document')).toHaveClass('custom-modal');
  });

  it('sets body overflow to hidden when open', () => {
    render(<BaseModal {...defaultProps} />);

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body overflow when closed', () => {
    const { rerender } = render(<BaseModal {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<BaseModal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('unset');
  });

  it('has correct accessibility attributes', () => {
    render(<BaseModal {...defaultProps} title="Accessible Modal" />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');

    const documentEl = screen.getByRole('document');
    expect(documentEl).toHaveAttribute('tabIndex', '-1');
  });

  it('handles missing onClose gracefully', () => {
    render(<BaseModal {...defaultProps} onClose={undefined} title="Test" />);

    // Should not crash when pressing Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    // No assertion about close button presence; just ensure no error is thrown
  });
});
