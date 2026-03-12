import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProfileIcon from './ProfileIcon';

describe('ProfileIcon Component', () => {
    it('9. should render initials when no photoUrl is provided', () => {
        render(<ProfileIcon email="test@example.com" completion={50} />);
        expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('10. should render profile image when photoUrl is provided', () => {
        const photoUrl = 'https://example.com/photo.jpg';
        render(<ProfileIcon photoUrl={photoUrl} completion={100} />);
        const img = screen.getByAltText('Profile');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', photoUrl);
    });
});
