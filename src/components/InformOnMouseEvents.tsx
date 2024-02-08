import { NarcEventData } from "./EventNarc";
import { InformOnWindowEvents } from "./InformOnWindowEvents";

type InformOnMouseEventsProps = {
  events?: Array<MouseEventTypes>;
  eventParser?: (e: MouseEvent) => NarcEventData<MouseEvent>;
  logFormatter?: (e: MouseEvent) => NarcEventData<MouseEvent>;
};

type MouseEventTypes =
  | "auxclick"
  | "click"
  | "contextmenu"
  | "dblclick"
  | "mousedown"
  | "mouseenter"
  | "mouseleave"
  | "mousemove"
  | "mouseout"
  | "mouseover"
  | "mouseup";

const DEFAULT_MOUSE_EVENT: Array<MouseEventTypes> = ["click"];

export const InformOnMouseEvents = ({
  events = DEFAULT_MOUSE_EVENT,
  eventParser,
  logFormatter,
}: InformOnMouseEventsProps) => {
  return (
    <InformOnWindowEvents<MouseEvent>
      events={events}
      eventDataParser={eventParser}
      eventLogFormatter={logFormatter}
    />
  );
};
