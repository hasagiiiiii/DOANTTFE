export const ModalessCustom = (url: string, nameScreen: string, data: any) => {
    const windowFeatures = 'width=1800,height=700,top=100';
    const searchParams = new URLSearchParams({
        isOpen: 'true',
    });

    const fullURL = `${window.location.origin}${url}?${searchParams.toString()}`;
    console.log('Opening new window:', fullURL);

    const newWindow = window.open(fullURL, nameScreen, windowFeatures);

    newWindow?.addEventListener('load', () => {
        // newWindow.postMessage(data, '*');
        console.log('12312341', data);
        setTimeout(() => {
            newWindow.postMessage({
                data: data,
                myCustomKey: true
            }, window.location.origin);
        }, 500);
    })
}