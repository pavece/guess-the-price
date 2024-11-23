import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { MainPage } from './pages/main-page';
import { ClassicModePage } from './pages/classic-mode-page';
import { MainLayout } from './layouts/main-layout';
import './index.css';
import { ThisOrThatPage } from './pages/this-that-page';
import { MultiplayerJoinPage } from './pages/multiplayer-join-page';
import { MultiplayerPage } from './pages/multiplayer-page';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route element={<MainLayout />}>
					<Route path='/' element={<MainPage />} />
					<Route path='/classic-mode' element={<ClassicModePage />} />
					<Route path='/this-that' element={<ThisOrThatPage />} />
					<Route path='/multiplayer' element={<MultiplayerJoinPage />} />
					<Route path='/multiplayer/:id' element={<MultiplayerPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
