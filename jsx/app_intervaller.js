var Intervaller = React.createClass({
    getInitialState: function() {
        return {
            modifyType: "change", // change, set
            changeType: "minutes", // minutes, hours, weeks, relative
            modifyAmount: 10,
            activeKeyIndex: 0
        };
    },
    onModeChange: function(newModeStr){
        if(newModeStr !== this.state.modifyType) {
            var newActiveKeyIndex = this.state.activeKeyIndex;
            if(newModeStr === "set" && this.state.changeType==="percent")
                newActiveKeyIndex = 0;
            this.setState({modifyType: newModeStr, activeKeyIndex: newActiveKeyIndex});
        }
    },
    getNewInterval: function(){
        var intervalDiff;
        if(this.state.modifyType === "change") {
            if (this.state.changeType === "percent") {
                intervalDiff = this.props.reviewInterval * this.state.modifyAmount/100.0;
                return intervalDiff + this.props.reviewInterval;
            } else {
                intervalDiff = moment.duration(this.state.modifyAmount, this.state.changeType.toLowerCase()).asMilliseconds();
                return this.props.reviewInterval + intervalDiff;
            }
        }
        else if(this.state.modifyType === "set") {
            return moment.duration(this.state.modifyAmount, this.state.changeType.toLowerCase()).asMilliseconds();
        }
    },
    onIntervalChoice: function(modifyAmount, keyIndex, changeType){
        if(this.state.activeKeyIndex === keyIndex){
            this.props.applyInterval(this.getNewInterval());
        }
        this.setState({
            activeKeyIndex: keyIndex,
            changeType: changeType,
            modifyAmount: modifyAmount
        });
    },
    render: function(){
        var intervals = [];
        var amount;
        var keyIndex = 0;
        var timeframeNumber = 0;
        for (var timeframeKey in this.props.timeIntervalChoices) {
            if(this.props.timeIntervalChoices[timeframeKey].length > 0){
                timeframeNumber++;
            }
            for (var j = 0; j < this.props.timeIntervalChoices[timeframeKey].length; ++j) {
                var buttonClassName = "button unselectable";
                buttonClassName += " interval"+timeframeNumber%2;
                if(keyIndex === this.state.activeKeyIndex)
                    buttonClassName += " buttonSelected";
                var plusEL = <span className={this.state.modifyType==="change"?"":"invisible"}>+</span>;
                amount = this.props.timeIntervalChoices[timeframeKey][j];
                var buttonStr = amount;
                if(timeframeKey === "Percent")
                    buttonStr += "%";
                else
                    buttonStr += timeframeKey.slice(0,1).toLowerCase();
                var labelElement = false;
                if(j===0){
                    labelElement = <div>{timeframeKey}</div>;
                }
                var isSetAndRelative = timeframeKey==="Percent" && this.state.modifyType==="set" ;
                intervals.push(
                    <span
                        key={keyIndex}
                        className={isSetAndRelative?"invisible":""}>
                        {labelElement}
                        <div
                            className={buttonClassName}
                            onClick={this.onIntervalChoice.bind(this, amount, keyIndex, timeframeKey.toLowerCase())}>{plusEL} {buttonStr}
                        </div>
                    </span>
                );
                keyIndex += 1;
            }
        }

        return(
            <div className={this.props.show?"":"invisible"}>
                <div className="intervalButtonCont">
                    <span >
                        <div>Type</div>
                        <div className={"button "+ (this.state.modifyType==="change"?"buttonGood":"")} onClick={this.onModeChange.bind(this, "change")}>change</div>
                    </span>
                    <span className={"button "+ (this.state.modifyType==="set"?"buttonGood":"")} onClick={this.onModeChange.bind(this, "set")}>set</span>
                    {intervals}
                </div>
                <div>Old interval: {getPreciseIntervalStr( this.props.reviewInterval )}</div>
                <div>New interval: {getPreciseIntervalStr( this.getNewInterval() )}</div>
                <div>Due on: {moment().add(moment.duration(this.getNewInterval())).format("dddd, YYYY-MM-DD, HH:mm") }</div>
            </div>
        );
    }
});
