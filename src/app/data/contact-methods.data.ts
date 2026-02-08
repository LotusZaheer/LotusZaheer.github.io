export interface ContactMethod {
    name: string;
    nick?: string;
    iconPath: string;
    url: string;
}

export const contactMethods: ContactMethod[] = [
    {
        name: 'LinkedIn',
        nick: 'andresfuribeg',
        iconPath: 'assets/images/networks/linkedin.svg',
        url: 'https://www.linkedin.com/in/andresfuribeg/'
    },
    {
        name: 'Email',
        nick: 'andresfelipeuribe11@gmail.com',
        iconPath: 'assets/images/networks/gmail.svg',
        url: 'mailto:andresfelipeuribe11@gmail.com'
    },
    {
        name: 'WhatsApp',
        nick: 'WhatsApp',
        iconPath: 'assets/images/networks/whatsapp.svg',
        url: 'https://wa.me/573016561380'
    }
];
