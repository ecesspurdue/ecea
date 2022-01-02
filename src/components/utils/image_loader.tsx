
// https://stackoverflow.com/questions/39092859/get-dimensions-of-image-with-react/
import React from "react";
import {ecessApiCall} from "../../utils/api";

type ImageLoaderProp = {
    style?: any,
    height: number,
    width: number | "100%",
    src: string
}

type ImageLoaderState = {
    dimensions: {
        width?: number| "100%",
        height?: number
    },
    src: undefined | string,
}

export class ImageLoader extends React.Component<ImageLoaderProp, ImageLoaderState> {
    constructor(props: ImageLoaderProp) {
        super(props);
        this.state = {dimensions: {}, src: undefined};
        this.onImgLoad = this.onImgLoad.bind(this);
    }

    componentDidMount() {
        this.getImageFromFb();
    }

    getImageFromFb() {
        ecessApiCall("bucket", undefined,
            {image: this.props.src},
            "https://ecess-api.matthewwen.com"
        ).then((item: any) => {
            this.setState({...this.state, src: item.image})
        })
    }

    onImgLoad({target:img}) {
        this.setState({...this.state, dimensions:{height:0,
                width:0}});
    }


    render(){
        const {width, height, style} = this.props;
        const {src} = this.state

        return (
            <>
                {src ?
                    <div
                        style={{
                            ...style,
                            width: width,
                            height: height,
                            backgroundImage: `url(${src})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />: <></>
                }
            </>
        );
    }

}