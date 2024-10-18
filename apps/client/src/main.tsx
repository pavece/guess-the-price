import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { MainPage } from './pages/main-page';
import { ClassicModePage } from './pages/classic-mode-page';
import { MainLayout } from './layouts/main-layout';
import './index.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route element={<MainLayout />}>
					<Route path='/' element={<MainPage />} />
					<Route path='/classic-mode' element={<ClassicModePage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
