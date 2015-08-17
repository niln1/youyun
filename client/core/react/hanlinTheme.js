let color = {
    SchoolDarkDolor: "#124720",// normal text color
    SchoolColor: "#3D714B",
    SchoolLightColor: "#81a98b",
    InverseColor: "#233B4D",
    InverseLightColor: "#4F6577",  // used for grey
    SuccessColor: "#008161",
    SuccessLightColor: "#81D8C2",
    ErrorColor: "#BD0E2D",
    ErrorLightColor: "#F894A6",
    InfoColor: "#DB8700",
    InfoLightColor: "#FFD898",
    BgColor: "#ecf0f1",
    FgColor: "#ffffff"
}
export default {
    getPalette() {
        return {};
    },
    getComponentThemes(palette) {
        return {
            textField: {
                textColor: color.FgColor,
                hintColor: palette.disabledColor,
                floatingLabelColor: color.SchoolDarkDolor,
                disabledTextColor: color.InverseLightColor,
                errorColor: color.ErrorColor,
                focusColor: color.SchoolDarkDolor,
                backgroundColor: 'transparent',
                borderColor: '#757575',
            },
        };
    }
}