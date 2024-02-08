import { NarcEventData } from "./EventNarc";
import { InformOnWindowEvents } from "./InformOnWindowEvents";

type KeyboardEventTypes = "keydown" | "keyup";

type InformOnKeyboardEventsProps = {
  events?: Array<KeyboardEventTypes>;
  eventParser?: (e: KeyboardEvent) => NarcEventData<KeyboardEvent>;
  logFormatter?: (e: KeyboardEvent) => NarcEventData<KeyboardEvent>;
};

const DEFAULT_KEYBOARD_EVENT: Array<KeyboardEventTypes> = ["keydown", "keyup"];

export const InformOnKeyboardEvents = ({
  events = DEFAULT_KEYBOARD_EVENT,
  eventParser,
  logFormatter,
}: InformOnKeyboardEventsProps) => {
  return (
    <InformOnWindowEvents<KeyboardEvent>
      events={events}
      eventDataParser={eventParser}
      eventLogFormatter={logFormatter}
    />
  );
};
