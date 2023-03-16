import { TanRating } from "./TanRating";
import { Links } from "./Links";

const tanEnabled = false;

export function App() {
  return (
    <div className="app">
      {!tanEnabled && <Links />}
      {tanEnabled && <TanRating />}
    </div>
  );
}
