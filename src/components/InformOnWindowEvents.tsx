import { useCallback, useEffect } from "react";

import { NarcEventData, useEventNarc } from "./EventNarc";

type EventName = keyof GlobalEventHandlersEventMap | string;

interface InformOnWindowEventsProps<T> {
  events: Array<EventName>;
  eventDataParser?: (e: T) => NarcEventData<T>;
  eventLogFormatter?: (e: T) => NarcEventData<T>;
}

export const InformOnWindowEvents = <T extends Event>({
  events,
  eventDataParser,
  eventLogFormatter,
}: InformOnWindowEventsProps<T>): null => {
  const { addToNarcLog } = useEventNarc();

  useEffect(() => {
    const trackEvent = (e: T) => {
      if (!events.includes(e.type)) return;
      const newEvent = createNarcEventData(e);
      addToNarcLog(newEvent);
    };

    for (const event of events) {
      window.addEventListener(event, trackEvent as EventListener);
    }
    return () => {
      for (const event of events) {
        window.removeEventListener(event, trackEvent as EventListener);
      }
    };
  }, [events]);

  const createNarcEventData = useCallback(
    (e: T): NarcEventData<T> => {
      if (eventLogFormatter) return eventLogFormatter(e);
      return {
        eventType: e.type,
        eventData: eventDataParser ? eventDataParser(e) : e,
      };
    },
    [events]
  );

  return null;
};
