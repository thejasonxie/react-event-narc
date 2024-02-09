# React Event Narc

A simple and flexible event tracker for React without any bloat. Have a narc inform you of critical user events in your application.

## Status

Please beware, React Event Narc is currently in development and may not be ready for production use.

## Usage

```jsx
<EventNarc
  informOn={(data) => ["error", "network"].some(data.eventType)}
  informTo={(data) => {
    sendToApi(data);
    sendToEmail(data);
  }}
>
  <InformOnMouseEvents />
  <InformOnErrorEvents />
  <InformOnKeyboardEvents />
  <InformOnNetworkEvents
    shouldLogEvent={(response) => response.status != 200}
  />
</EventNarc>
```
