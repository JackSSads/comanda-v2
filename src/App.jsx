import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";

import { LayoutBase } from "./layouts"
import { PageProvider, ToggleViewProvider } from "./contexts";

export const App = () => {
  return (
    <BrowserRouter>
      <PageProvider>
        <ToggleViewProvider>
          <LayoutBase title="comandas" url="comandas">
            <AppRoutes />
          </LayoutBase>
        </ToggleViewProvider>
      </PageProvider>
    </BrowserRouter>
  );
};
