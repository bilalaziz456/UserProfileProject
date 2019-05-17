import React, {Component} from 'react';
import AutoSuggest from 'react-autosuggest';
import Drop from 'react-select';
import 'react-dropdown/style.css'

const ratingInterest = [{value : 1, label : 1},
                        {value : 1.5, label : 1.5},
                        {value : 2, label : 2},
                        {value : 2.5, label : 2.5},
                        {value : 3, label : 3},
                        {value : 3.5, label : 3.5},
                        {value : 4, label : 4},
                        {value : 4.5, label : 4.5},
                        {value : 5, label : 5},
                        {value : 5.5, label : 5.5},
                        {value : 6, label : 6},
                        {value : 6.5, label : 6.5},
                        {value : 7, label : 7},
                        {value : 7.5, label : 7.5},
                        {value : 8, label : 8},
                        {value : 8.5, label : 8.5},
                        {value : 9, label : 9},
                        {value : 9.5, label : 9.5},
                        {value : 10, label : 10}];
const experience = [{value : 1, label : 1},
                    {value : 2, label : 2},
                    {value : 3, label : 3},
                    {value : 4, label : 4},
                    {value : 5, label : 5},
                    {value : 6, label : 6},
                    {value : 7, label : 7},
                    {value : 8, label : 8},
                    {value : 9, label : 9},
                    {value : 10, label : 10},
                    {value : 11, label : 11},
                    {value : 12, label : 12},
                    {value : 13, label : 13},
                    {value : 14, label : 14},
                    {value : 15, label : 15},
                    {value : 16, label : 16},
                    {value : 17, label : 17},
                    {value : 18, label : 18},
                    {value : 19, label : 19},
                    {value : 20, label : 20},
                    {value : 21, label : 21},
                    {value : 22, label : 22},
                    {value : 23, label : 23},
                    {value : 24, label : 24},
                    {value : 25, label : 25},
                    {value : 26, label : 26},
                    {value : 27, label : 27},
                    {value : 28, label : 28},
                    {value : 29, label : 29},
                    {value : 30, label : 30},
                    {value : 31, label : 31},
                    {value : 32, label : 32},
                    {value : 33, label : 33},
                    {value : 34, label : 34},
                    {value : 35, label : 35},
                    {value : 36, label : 36},
                    {value : 37, label : 37},
                    {value : 38, label : 38},
                    {value : 39, label : 39},
                    {value : 40, label : 40},
                    {value : 41, label : 41},
                    {value : 42, label : 42},
                    {value : 43, label : 43},
                    {value : 44, label : 44},
                    {value : 45, label : 45},
                    {value : 46, label : 46},
                    {value : 47, label : 47},
                    {value : 48, label : 48},
                    {value : 49, label : 49},
                    {value : 50, label : 50}];
const getSuggestionValue = suggestion => suggestion.value;

const renderSuggestion = suggestion => (
    <div>
        {suggestion.value}
    </div>
);
class AddSearchFilters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions : [],
            value : this.props.value.skill,
        };
        this.removeFilter = this.removeFilter.bind(this);
        this.handleFromRating = this.handleFromRating.bind(this);
        this.handleToRating = this.handleToRating.bind(this);
        this.handleFromInterest = this.handleFromInterest.bind(this);
        this.handleToInterest = this.handleToInterest.bind(this);
        this.handleFromExperience = this.handleFromExperience.bind(this);
        this.handleToExperience = this.handleToExperience.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.sendSKillValue = this.sendSKillValue.bind(this);
    }

    removeFilter() {
        this.props.removeFilter(this.props.id)
    }
    handleFromRating(opt){
        let fromRating = this.props.value;
        fromRating.fromRating = opt.value;
        this.props.handleSearchChange(this.props.id, fromRating)
    }
    handleToRating(opt){
        let toRating = this.props.value;
        toRating.toRating = opt.value;
        this.props.handleSearchChange(this.props.id, toRating)
    }
    handleFromInterest(opt){
        let fromInterest = this.props.value;
        fromInterest.fromInterest = opt.value;
        this.props.handleSearchChange(this.props.id, fromInterest)
    }
    handleToInterest(opt){
        let toInterest = this.props.value;
        toInterest.toInterest = opt.value;
        this.props.handleSearchChange(this.props.id, toInterest)
    }
    handleFromExperience(opt){
        let fromExperience = this.props.value;
        fromExperience.fromExperience = opt.value;
        this.props.handleSearchChange(this.props.id, fromExperience)
    }
    handleToExperience(opt){
        let toExperience = this.props.value;
        toExperience.toExperience = opt.value;
        this.props.handleSearchChange(this.props.id, toExperience)
    }
    getSuggestions(value){
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.props.options.filter(opt =>
            opt.value.toLowerCase().slice(0, inputLength) === inputValue
        );
    }


    onSuggestionsFetchRequested({ value }){
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };
    onSuggestionsClearRequested() {
        this.setState({
            suggestions: []
        });
    };
    sendSKillValue(event){
        let search = this.props.value;
        search.skill = event.target.value;
        this.props.handleSearchChange(this.props.id, search);
        this.setState({
            value : this.props.value.skill
        })

    }
    onSearchChange (event, {newValue}){
        this.setState({
            value : newValue
        });

    };
    render() {
        const {value, suggestions } = this.state;
        const inputProps = {
            placeholder: 'Search...',
            value ,
            onChange: this.onSearchChange,
            onBlur : this.sendSKillValue,

            type: 'search'
        };


        return (
            <div>
                <div className="btn-group float-right" role="group">
                    <a className="btn btn-primary btn-md" onClick={this.removeFilter}>x</a>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <label htmlFor="skill">Skill:</label>
                        <AutoSuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={inputProps}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3"><br/>
                        <label htmlFor="rating">Rating:</label><br/>
                        <div className="row">
                            <div className="col-md-6">
                                <span>From: </span>
                                <Drop   options={ratingInterest} id="rating" className="drop-down"
                                        captureMenuScroll={false}
                                        onChange={this.handleFromRating}
                                        defaultValue={{
                                            value: this.props.value.fromRating,
                                            label: this.props.value.fromRating
                                        }}
                                />
                            </div>
                            <div className="col-md-6">
                                <span>To: </span>
                                <Drop   options={ratingInterest} id="rating" className="drop-down"
                                        captureMenuScroll={false}
                                        onChange={this.handleToRating} onFocus={this.checkRating}
                                        defaultValue={{
                                            value: this.props.value.toRating,
                                            label: this.props.value.toRating
                                        }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3"> <br/>
                        <label htmlFor="interest">Interest:</label>
                        <div className="row">
                            <div className="col-md-6">
                                <span>From: </span>
                                <Drop   options={ratingInterest}  className="drop-down"
                                        captureMenuScroll={false}
                                        onChange={this.handleFromInterest}
                                        defaultValue={{
                                            value: this.props.value.fromInterest,
                                            label: this.props.value.fromInterest
                                        }}
                                />
                            </div>
                            <div className="col-md-6">
                                <span>To: </span>
                                <Drop   options={ratingInterest} id="rating" className="drop-down"
                                        captureMenuScroll={false}
                                        onChange={this.handleToInterest}
                                        defaultValue={{
                                            value: this.props.value.toInterest,
                                            label: this.props.value.toInterest
                                        }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3"><br/>
                        <div className="form-group">
                            <label htmlFor="experience">Experience:</label>
                            <div className="row">
                                <div className="col-md-6">
                                    <span>From: </span>
                                    <Drop   options={experience}  className="drop-down"
                                            captureMenuScroll={false}
                                            onChange={this.handleFromExperience}
                                            defaultValue={{
                                                value: this.props.value.fromExperience,
                                                label: this.props.value.fromExperience
                                            }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <span>To: </span>
                                    <Drop   options={experience} id="rating" className="drop-down"
                                            captureMenuScroll={false}
                                            onChange={this.handleToExperience}
                                            defaultValue={{
                                                value: this.props.value.toExperience,
                                                label: this.props.value.toExperience
                                            }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default AddSearchFilters;