import 'styled-components';
import theme from './theme';

declare module 'styled-components'{   //sobrescrever meu tema
    type ThemeType = typeof theme     //criar um novo tipo chamamos de ThemeType e o typeof copia exatamente o tipo de um objeto

    export interface DefaultTheme extends ThemeType {}
}