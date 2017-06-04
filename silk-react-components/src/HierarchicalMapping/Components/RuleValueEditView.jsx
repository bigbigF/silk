import React from 'react';
import UseMessageBus from '../UseMessageBusMixin';
import {
    Button,
    TextField,
    SelectBox,
    ConfirmationDialog,
    AffirmativeButton,
    DismissiveButton,
    DisruptiveButton,
} from 'ecc-gui-elements';
import hierarchicalMappingChannel from '../store';
import {Rx} from 'ecc-messagebus';
import _ from 'lodash';

const RuleValueEditView = React.createClass({
    mixins: [UseMessageBus],

    // define property types
    // FIXME: check propTypes
    propTypes: {
        comment: React.PropTypes.string,
        id: React.PropTypes.string,
        //operator: React.PropTypes.object,
        type: React.PropTypes.string,
        // FIXME: sourcePath === source property?
        sourcePath: React.PropTypes.string,
        mappingTarget: React.PropTypes.object,
        onClose: React.PropTypes.func,
        edit: React.PropTypes.bool.isRequired,
        handleToggleExpand: React.PropTypes.func,
    },

    getInitialState() {
        return {
            comment: this.props.comment || '',
            targetProperty: _.get(this.props, 'mappingTarget.uri', undefined),
            propertyType: _.get(this.props, 'mappingTarget.valueType.nodeType', undefined),
            sourceProperty: this.props.sourcePath,
            edit: this.props.edit,
        };
    },

    handleConfirm(event) {
        event.stopPropagation();
        hierarchicalMappingChannel.request({topic: 'rule.createValueMapping', data: {
            id: this.props.id,
            parentId: this.props.parentId,
            type: this.props.type,
            comment: this.state.comment,
            targetProperty: this.state.targetProperty,
            propertyType: this.state.propertyType,
            sourceProperty: this.state.sourceProperty,
        }}) .subscribe(
            () => {
                // FIXME: let know the user which element is gone!
                this.setState({
                    elementToDelete: false,
                });
            },
            (err) => {
                // FIXME: let know the user what have happened!
                this.setState({
                    elementToDelete: false,
                });
            }
        );

        this.handleClose(event);
    },
    // remove rule
    handleClickRemove(event) {
        event.stopPropagation();
        this.setState({
            elementToDelete: this.props.id,
        });
    },

    handleChangeTextfield(state, {value}) {
        this.setState({
            [state]: value,
        });
    },
    handleChangeSelectBox(state, value) {
        this.setState({
            [state]: value,
        });
    },
    handleComplexEdit(event) {
        event.stopPropagation();
        alert('Normally this would open the complex editor (aka jsplumb view)')
    },
    // open view in edit mode
    handleEdit(event) {
        event.stopPropagation();
        this.setState({
            edit: !this.state.edit,
        })
    },
    handleClose(event) {
        event.stopPropagation();
        if(_.isFunction(this.props.onClose)){
            this.props.onClose();
        } else {
            this.setState({
                edit: false,
            })
        }
    },
    handleConfirmRemove(event) {
        event.stopPropagation();
        hierarchicalMappingChannel.request({topic: 'rule.removeRule', data: {id: this.state.elementToDelete}})
            .subscribe(
                () => {
                    // FIXME: let know the user which element is gone!
                    this.setState({
                        elementToDelete: false,
                    });
                },
                (err) => {
                    // FIXME: let know the user what have happened!
                    this.setState({
                        elementToDelete: false,
                    });
                }
            );
    },
    handleCancelRemove() {
        event.stopPropagation();
        this.setState({
            elementToDelete: false,
        });
    },
    // template rendering
    render () {
        const {
            id,
            type = 'direct',
        } = this.props;
        const {edit} = this.state;

        // FIXME: also check if data really has changed before allow saving
        const allowConfirm = this.state.targetProperty;

        const title = (
            edit && !id ? (
                <div className="mdl-card__title mdl-card--border">
                    Add value mapping
                </div>
            ) : false
        );

        //TODO: Where to get the list of target Properties?
        const targetPropertyInput = (
            edit ? (
                <SelectBox
                    placeholder={'Choose target property'}
                    className="ecc-silk-mapping__ruleseditor__targetProperty"
                    options={[
                        'http://xmlns.com/foaf/0.1/name',
                        'http://xmlns.com/foaf/0.1/knows',
                        'http://xmlns.com/foaf/0.1/familyName',
                    ]}
                    value={this.state.targetProperty}
                    onChange={this.handleChangeSelectBox.bind(null, 'targetProperty')}
                />
            ) : (
                <div
                    className="ecc-silk-mapping__ruleseditor__targetProperty"
                >
                    Target property
                    {this.state.targetProperty}
                </div>
            )
        );

        //TODO: Where to get the list of target property types?
        const propertyTypeInput = (
            edit ? (
                <SelectBox
                    placeholder={'Choose property type'}
                    className="ecc-silk-mapping__ruleseditor__propertyType"
                    options={[
                        "AutoDetectValueType",
                        "UriValueType",
                        "BooleanValueType",
                        "StringValueType",
                        "IntegerValueType",
                        "LongValueType",
                        "FloatValueType",
                        "DoubleValueType",
                    ]}
                    value={this.state.propertyType || "AutoDetectValueType"}
                    onChange={this.handleChangeSelectBox.bind(null, 'propertyType')}
                />
            ) : (
                <div
                    className="ecc-silk-mapping__ruleseditor__propertyType"
                >
                    Property type
                    {this.state.propertyType}
                </div>
            )
        );

        //TODO: Unfold complex mapping
        let sourceProperty = edit ? false : (
            <div>
                Source property
                {this.state.sourceProperty || 'Complex Mapping'}
            </div>
        );


        console.warn(type);

        if (edit && type === 'direct') {
            sourceProperty = (
                <TextField
                    label={'Source property'}
                    onChange={this.handleChangeTextfield.bind(null, 'sourceProperty')}
                    value={this.state.sourceProperty}
                />
            );
        } else if (edit && type === 'complex') {
            sourceProperty = (
                <TextField
                    disabled={true}
                    label="Source property"
                    value="Complex Mapping"
                />
            )
        }

        const commentInput = (
            edit ? (
                <TextField
                    multiline={true}
                    label="Comment"
                    className="ecc-silk-mapping__ruleseditor__comment"
                    value={this.state.comment}
                    onChange={this.handleChangeTextfield.bind(null, 'comment')}
                />
            ) : (
                <div
                    className="ecc-silk-mapping__ruleseditor__comment"
                >
                    Comment
                    {this.state.comment}
                </div>
            )
        );

        const actionRow = (
            edit ? (
                <div className="ecc-silk-mapping__ruleseditor__actionrow mdl-card__actions mdl-card--border">
                    <AffirmativeButton
                        className="ecc-silk-mapping__ruleseditor__actionrow-save"
                        onClick={this.handleConfirm}
                        disabled={!allowConfirm}
                    >
                        Save
                    </AffirmativeButton>
                    <DismissiveButton
                        className="ecc-silk-mapping__ruleseditor___actionrow-cancel"
                        onClick={this.handleClose}
                    >
                        Cancel
                    </DismissiveButton>
                </div>
            ) : (
                <div className="ecc-silk-mapping__ruleseditor__actionrow mdl-card__actions mdl-card--border">
                    <Button
                        className="ecc-silk-mapping__ruleseditor__actionrow-edit"
                        onClick={this.handleEdit}
                    >
                        Edit rule
                    </Button>
                    <Button
                        className="ecc-silk-mapping__ruleseditor__actionrow-complex-edit"
                        onClick={this.handleComplexEdit}
                    >
                        Edit complex
                    </Button>
                    <DisruptiveButton
                        className="ecc-silk-mapping__ruleseditor__actionrow-remove"
                        onClick={this.handleClickRemove}
                        disabled={false} // FIXME: all elements are removable?
                    >
                        Remove rule
                    </DisruptiveButton>
                </div>
            )
        );

        const deleteView = this.state.elementToDelete
            ? <ConfirmationDialog
                active={true}
                title="Delete Rule"
                confirmButton={
                    <DisruptiveButton disabled={false} onClick={this.handleConfirmRemove}>
                        Delete
                    </DisruptiveButton>
                }
                cancelButton={
                    <DismissiveButton onClick={this.handleCancelRemove}>
                        Cancel
                    </DismissiveButton>
                }>
                Are you sure you want to delete the rule with id '{this.state.elementToDelete}'?
            </ConfirmationDialog>
            : false;

        // FIXME: created and updated need to be formated. Creator is not available in Dataintegration :(

        return (
            edit ? (
                <div
                    className="ecc-silk-mapping__ruleseditor"
                >
                    <div className={
                            "mdl-card mdl-card--stretch" +
                            (!id ? ' mdl-shadow--2dp' : '')
                    }>
                        {title}
                        <div className="mdl-card__content">
                            {targetPropertyInput}
                            {propertyTypeInput}
                            {sourceProperty}
                            {commentInput}
                        </div>
                        {actionRow}
                    </div>
                </div>
            ) : (
                <div
                    className="ecc-silk-mapping__rulesview"
                >
                    {deleteView}
                    <div className="mdl-card mdl-card--stretch">
                        <div
                            onClick={this.props.handleToggleExpand}
                            className="mdl-card__content"
                        >
                            {targetPropertyInput}
                            {propertyTypeInput}
                            {sourceProperty}
                            {commentInput}

                            <div className="ecc-silk-mapping__ruleseditor__created">Created {this.props.created ? this.props.created : 0}</div>
                            <div className="ecc-silk-mapping__ruleseditor__updated">Updated {this.props.updated ? this.props.updated : 0}</div>
                        </div>
                        {actionRow}
                    </div>
                </div>
            )
        );
    },

});

export default RuleValueEditView;
