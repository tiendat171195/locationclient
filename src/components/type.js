import{
    Dimensions
} from 'react-native';

export const { width, height } = Dimensions.get('window');
export const ASPECT_RATIO = width / height;

//Colors
export const MAIN_COLOR = "#00ffcc";
export const MAIN_COLOR_DARK = "#00B28E";
export const CONTENT_COLOR = "gainsboro";
export const MAIN_TEXT_COLOR = "black";
export const CONTENT_TEXT_COLOR = "midnightblue";
export const PLACEHOLDER_TEXT_COLOR = "grey";
export const ACTIONBUTTON_COLOR = 'rgba(231,76,60,1)';
//Fonts
export const MAIN_FONT = "sans-serif-thin"; 

//Maps
export const CALLOUT_BACKGROUND_COLOR = "lightsteelblue";
export const LATITUDE_DELTA = 0.01;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


//Server
//export const SERVER_PATH = 'https://stormy-woodland-18039.herokuapp.com/';
export const SERVER_PATH = 'http://192.168.83.2:3000/';

//Material UI

export const TOOLBAR_HEIGHT = 56;
export const LISTITEM_HEIGHT = 72;

