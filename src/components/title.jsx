import * as React from "react";

export const Title = ({ icon, children }) => (
  <>
    {icon && <i class={icon + " me-3"} />}
    <h1 className="fira-code-bold">{children}</h1>
  </>
)


