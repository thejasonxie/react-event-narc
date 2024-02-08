import { useEffect } from "react";
import { NarcEventData, useEventNarc } from "./EventNarc";

interface InformOnNetworkEventsProps {
  shouldLogEvent?: (response: Response) => boolean;
  logFormatter?: (response: Response) => NarcEventData<Response | any>;
}

const defaultShouldLogEvent = (response: Response) => {
  return response.status !== 200;
};

const defaultLogFormatter = (response: Response) => {
  const eventType = "network";
  const eventData = {
    status: response.status,
    statusText: response.statusText,
    url: response.url,
  };
  return { eventType, eventData };
};

export const InformOnNetworkEvents = ({
  shouldLogEvent = defaultShouldLogEvent,
  logFormatter = defaultLogFormatter,
}: InformOnNetworkEventsProps) => {
  const { addToNarcLog } = useEventNarc();

  useEffect(() => {
    const originalFetch = fetch;

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      const clone = response.clone();

      if (shouldLogEvent(clone)) {
        const newEvent = logFormatter(clone);
        addToNarcLog(newEvent);
      }

      return response;
    };
    return () => {};
  }, []);

  return null;
};
