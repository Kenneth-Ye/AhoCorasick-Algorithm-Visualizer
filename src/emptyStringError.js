import './App.css';

const EmptyString = (props) => {
    const {showError} = props;
    if (showError) {
        return (
            <div className="emptyWarning">
                No Empty Strings!
            </div>
        )
    }
    return null;
}
export default EmptyString;
