import React from 'react';
import { render, RenderOptions, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Enhanced version of your AllTheProviders
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <BrowserRouter>
            {children}
        </BrowserRouter>
    );
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    route?: string;
}

const customRender = (
    ui: React.ReactElement,
    options?: CustomRenderOptions
) => {
    const { route = '/', ...renderOptions } = options || {};
    window.history.pushState({}, 'Test page', route);

    return {
        user: userEvent.setup(),
        ...render(ui, { wrapper: AllTheProviders, ...renderOptions })
    };
};

// Custom queries
const findTableCell = async (container: HTMLElement, columnName: string, rowText: string) => {
    const table = within(container).getByRole('table');
    const rows = within(table).getAllByRole('row');

    // Find header index
    const headers = within(rows[0]).getAllByRole('columnheader');
    const columnIndex = headers.findIndex(header => header.textContent === columnName);

    // Find row
    const targetRow = rows.find(row => row.textContent?.includes(rowText));
    if (!targetRow) throw new Error(`Row containing "${rowText}" not found`);

    const cells = within(targetRow).getAllByRole('cell');
    return cells[columnIndex];
};

export * from '@testing-library/react';
export { customRender as render, findTableCell };