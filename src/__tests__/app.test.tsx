import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';
import { AppProvider, useApp } from '../context/AppContext';

const TestComponent = () => {
  const { currentUser, hasPermission, tasks, updateTaskStatus, auditLogs } = useApp();
  return (
    <div>
      <span data-testid="user-role">{currentUser.role}</span>
      <span data-testid="perm-sensitive">
        {hasPermission('view_sensitive_records') ? 'ALLOWED' : 'DENIED'}
      </span>
      <span data-testid="perm-manage-staff">
        {hasPermission('manage_staff') ? 'ALLOWED' : 'DENIED'}
      </span>
      <button
        data-testid="complete-task-btn"
        onClick={() => updateTaskStatus(tasks[0].id, 'Completed', 'Test note')}
      >
        Complete Task
      </button>
      <span data-testid="task-status">{tasks[0]?.status}</span>
      <span data-testid="audit-count">{auditLogs.length}</span>
    </div>
  );
};

describe('Role-Based Access Control (RBAC) & Context Tests', () => {
  it('correctly evaluates permissions based on active role', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    // Initial role is Nurse
    expect(screen.getByTestId('user-role').textContent).toBe('Nurse');
    expect(screen.getByTestId('perm-sensitive').textContent).toBe('ALLOWED');
    expect(screen.getByTestId('perm-manage-staff').textContent).toBe('DENIED');
  });

  it('updates task completion status and logs audit entry', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const initialLogsCount = Number(screen.getByTestId('audit-count').textContent);
    const completeBtn = screen.getByTestId('complete-task-btn');

    fireEvent.click(completeBtn);

    expect(screen.getByTestId('task-status').textContent).toBe('Completed');
    const newLogsCount = Number(screen.getByTestId('audit-count').textContent);
    expect(newLogsCount).toBeGreaterThan(initialLogsCount);
  });

  it('renders main application header and navigation items', () => {
    render(<App />);

    expect(screen.getByText('Log my Care')).toBeDefined();
    expect(screen.getByText('Residents')).toBeDefined();
    expect(screen.getByText("Today's To-Dos")).toBeDefined();
    expect(screen.getByText('Care Plans')).toBeDefined();
  });
});
