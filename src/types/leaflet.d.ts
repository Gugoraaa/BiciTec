import 'leaflet';

declare module 'leaflet' {
  namespace L {
    interface IconOptions {
      iconRetinaUrl?: string;
      iconUrl: string;
      shadowUrl?: string;
      iconSize?: [number, number];
      iconAnchor?: [number, number];
    }
    
    class Icon {
      constructor(options: IconOptions);
    }
    
    let Icon: {
      Default: {
        mergeOptions: (options: IconOptions) => void;
      };
      new (options: IconOptions): Icon;
    };
  }
}
