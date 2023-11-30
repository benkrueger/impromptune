import React from "react";
import { Routes, Route } from "react-router";
import ROUTES from "Constants/routes";
import loadable from "@loadable/component";

// Load bundles asynchronously so that the initial render happens faster
const Composition = loadable(() =>
  import(/* webpackChunkName: "CompositionChunk" */ "Pages/composition/composition")
);

const CompositionPlan = loadable(() =>
  import(/* webpackChunkName: "CompositionPlanChunk" */ "Pages/composition/CompositionPlan")
);

class AppRoutes extends React.Component {
  render() {    
    return (
      <Routes>
        <Route path={ROUTES.COMPOSITION} element={<Composition CompositionPlanRef={CompositionPlan} />}></Route>
        <Route path={ROUTES.OUTPUT_PLAN} element={<CompositionPlan />}></Route>
        
      </Routes>
    );
  }
}

export default AppRoutes;
