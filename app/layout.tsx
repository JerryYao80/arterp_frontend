'use client';

import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './store';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {children}
              </SnackbarProvider>
            </ThemeProvider>
          </LocalizationProvider>
        </Provider>
      </body>
    </html>
  );
}
