import React from 'react'

const Checkbox = ({ size, isChecked, onChange }) => {
    return (
        <div>
            <input type='checkbox' checked={isChecked} style={{ height: size?size:25, width:size?size:25 }}
                onChange={onChange}>
            </input>
        </div>
    );
}

export default React.memo(Checkbox, /*(prevProps, nextProps) => prevProps.isChecked === nextProps.isChecked*/);