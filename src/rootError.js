import './App.css';

const RootString = (props) => {
    const {showError} = props;
    if (showError) {
        return (
            <div className="rootWarning">
                Cannot Input Root
            </div>
        )
    }
    return null;
}
export default RootString;
