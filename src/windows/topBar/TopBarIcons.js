import React from "react";
import './TopBarIcons.css'

const TopBarIcons= ({info , isSelected , onClick}) =>{
    return(
        <div className="topBarIconMainBody">
            {
                isSelected?
                <>
                    <button className="topBarIconButtonOn topBarIcon" onClick={onClick}>
                        {info}
                    </button>
                    <div className="iconHorizontalLine"></div>
                </>
                :
                <>
                    <button className="topBarIconButtonOff topBarIcon" onClick={onClick}>
                        {info}
                    </button>
                </>
            }
        </div>

    )
}

export default TopBarIcons;