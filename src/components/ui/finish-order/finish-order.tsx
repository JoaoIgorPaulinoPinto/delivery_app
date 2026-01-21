import FinishOrderUI from "./finish-order.ui";

export default function FinishOrder(props: {
  onOverlayStateChange?: (v: boolean) => void;
}) {
  return <FinishOrderUI {...props} />;
}
