import { HashRouter } from 'react-router-dom';
import RenderRouter from './router';
import { Provider } from 'react-redux';
import store from '@/store/index';
function App() {
  return (
    <HashRouter>
      <Provider store={store}>
        <RenderRouter />
      </Provider>
    </HashRouter>
  );
}

export default App;
