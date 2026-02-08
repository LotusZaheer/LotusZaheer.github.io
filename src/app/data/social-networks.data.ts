export interface SocialNetwork {
    name: string;
    nick?: string;
    iconPath: string;
    url: string;
}

export const socialNetworks: SocialNetwork[] = [
    {
        name: 'LinkedIn',
        nick: 'andresfuribeg',
        iconPath: 'assets/images/networks/linkedin.svg',
        url: 'https://www.linkedin.com/in/andresfuribeg/'
    }
]; 