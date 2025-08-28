'use client';

import { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import Button from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  footer?: ReactNode;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
}: ModalProps) => {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay animate-fade-in"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={cn(
          'modal-content animate-scale-in',
          sizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        {(title || showCloseButton) && (
          <div className="card-header flex items-center justify-between">
            {title && (
              <h2 
                id="modal-title"
                className="text-heading-3 text-gray-900"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 hover:bg-gray-100"
                aria-label="모달 닫기"
              >
                <X size={20} />
              </Button>
            )}
          </div>
        )}

        {/* 모달 본문 */}
        <div className="card-body">
          {children}
        </div>

        {/* 모달 푸터 */}
        {footer && (
          <div className="card-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
