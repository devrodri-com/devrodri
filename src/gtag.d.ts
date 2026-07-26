type Gtag = {
  (
    command: "event",
    eventName: "page_view",
    params: {
      page_title: string;
      page_location: string;
      page_path: string;
    },
  ): void;
  (
    command: "event",
    eventName: "click",
    params: {
      label: string;
    },
  ): void;
};

interface Window {
  gtag?: Gtag;
}
