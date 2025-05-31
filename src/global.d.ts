declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.jpeg' {
    const value: string;
    export default value;
}
declare module '*.mp4' {
    const value: string;
    export default value;
}
declare module '*.gif' {
    const value: string;
    export default value;
}
declare module '*.svg' {
    const value: string;
    export default value;
}
declare module '@chakra-ui/react';
declare module '*.svg' {
    import * as React from 'react';
    const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
}
