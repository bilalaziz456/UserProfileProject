import React, {Component} from 'react';
import CategorySkill from './CategorySkill';

const GET_CATEGORY = 'http://127.0.0.1:3000/getCategory';
const SEND_DATA = 'http://127.0.0.1:3000/insertData';
const JOB_TYPE = 'http://127.0.0.1:3000/jobType';
const SEND_JOB_TYPE = 'http://127.0.0.1:3000/insertJobType';

class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobType: [],
            jobTypeData: [],
            checkJobType : [],
            categoryOptions: [],
            message: '',
            data: [{
                category: "",
                label: "",
                skills: [
                    {skill: "", skillLabel: "", rating: 0, experience: 0, interest: 0, comment: ""}
                ]
            }]
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleChanges = this.handleChanges.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.removeCategory = this.removeCategory.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.removeSkill = this.removeSkill.bind(this);
        this.handleSkillChanges = this.handleSkillChanges.bind(this);
        this.insertData = this.insertData.bind(this);
        this.handleCategoryIndexChangeUpward = this.handleCategoryIndexChangeUpward.bind(this);
        this.handleCategoryIndexChangeDownward = this.handleCategoryIndexChangeDownward.bind(this);
        this.handleSkillIndexChangeUpward = this.handleSkillIndexChangeUpward.bind(this);
        this.handleSkillIndexChangeDownward = this.handleSkillIndexChangeDownward.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
    }
    handleCheckBox(e){
        let checkBox = this.state.checkJobType;

        if(e.target.checked){
            checkBox.push(this.state.jobTypeData[e.target.value].jobType);
            this.setState({
                checkJobType : checkBox
            });
        } else {
            checkBox.splice(e.target.value , 1);
            this.setState({
                checkJobType : checkBox
            });
        }

    }
    componentDidMount() {
        fetch(GET_CATEGORY).then((res) => {
            res.json().then((value) => {
                this.setState({
                    categoryOptions: value.map((opt) => opt)
                });
            });
        });
        fetch(JOB_TYPE).then((res) => {
            res.json().then((jobType) => {
                this.setState({
                    jobTypeData : jobType,
                    jobType: jobType.map((value, index) => {
                        return (
                            <div className="form-check-inline" key={index}>
                                <label className="form-check-label">
                                    <input type="checkbox" className="form-check-input" onChange={this.handleCheckBox} value={index}/>{value.jobType}
                                </label>
                            </div>
                        )
                    })
                })
            })
        })
    }

    insertData(e) {
        fetch(SEND_DATA, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
                data: this.state.data
            })
        }).then((res) => {
            res.json().then((value) => {
                this.setState({
                    message: value.message
                })
            })
        }).catch((err) => {
            console.log(err)
        });
        fetch(SEND_JOB_TYPE, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
                jobType: this.state.checkJobType
            })
        }).then((res)=>{
            res.json().then(()=>{
                console.log('Succefull');
            })
        });
        e.preventDefault();
    }

    addCategory() {
        let manipulateData = this.state.data;
        manipulateData.push({
            category: "",
            label: "",
            skills: [
                {skill: "", skillLabel: "", rating: 0, experience: 0, interest: 0, comment: ""}
            ]
        });
        this.setState({
            data: manipulateData
        });

    }

    addSkill(index) {
        let manipulateData = this.state.data;
        manipulateData[index].skills.push({
            skill: "", skillLabel: "", rating: 0, experience: 0, interest: 0, comment: ""
        });
        this.setState({
            data: manipulateData
        });
    }

    removeCategory(index) {
        let manipulateData = this.state.data;
        manipulateData.splice(index, 1);
        this.setState({
            data: manipulateData
        });
    }

    removeSkill(categoryIndex, skillIndex) {
        console.log('categoryIndex: ' + categoryIndex + 'skillIndex: ' + skillIndex);
        let manipulateData = this.state.data;
        manipulateData[categoryIndex].skills.splice(skillIndex, 1);
        this.setState({
            data: manipulateData
        });
    }

    handleChanges(index, value, label) {
        let manipulateData = this.state.data;
        manipulateData[index].category = value;
        manipulateData[index].label = label;
        this.setState({
            data: manipulateData
        });
    }

    handleCategoryIndexChangeUpward(currentIndex, newIndex) {
        let swap = [];
        let manipulateData = this.state.data;
        swap = manipulateData[currentIndex];
        manipulateData[currentIndex] = manipulateData[newIndex];
        manipulateData[newIndex] = swap;
        this.setState({
            date: manipulateData
        });
    }

    handleCategoryIndexChangeDownward(currentIndex, newIndex) {
        let swap = [];
        let manipulateData = this.state.data;
        swap = manipulateData[currentIndex];
        manipulateData[currentIndex] = manipulateData[newIndex];
        manipulateData[newIndex] = swap;
        this.setState({
            date: manipulateData
        });
    }

    handleSkillChanges(categoryIndex, skillIndex, skillObject) {
        let manipulateData = this.state.data;
        manipulateData[categoryIndex].skills[skillIndex] = skillObject;
        this.setState({
            data: manipulateData
        });
    }

    handleSkillIndexChangeUpward(categoryIndex, skillCurrentIndex, skillNewIndex) {
        let swap = [];
        let manipulateData = this.state.data;
        swap = manipulateData[categoryIndex].skills[skillCurrentIndex];
        manipulateData[categoryIndex].skills[skillCurrentIndex] = manipulateData[categoryIndex].skills[skillNewIndex];
        manipulateData[categoryIndex].skills[skillNewIndex] = swap;
        this.setState({
            data: manipulateData
        })
    }

    handleSkillIndexChangeDownward(categoryIndex, skillCurrentIndex, skillNewIndex) {
        let swap = [];
        let manipulateData = this.state.data;
        swap = manipulateData[categoryIndex].skills[skillCurrentIndex];
        manipulateData[categoryIndex].skills[skillCurrentIndex] = manipulateData[categoryIndex].skills[skillNewIndex];
        manipulateData[categoryIndex].skills[skillNewIndex] = swap;
        this.setState({
            data: manipulateData
        })
    }

    render() {
        return (
            <div>
                {this.state.jobType}
                <div className='top'>
                    <button type="submit" className="btn btn-primary" onClick={this.addCategory}>+Add
                        Category
                    </button>
                </div>

                {
                    this.state.data.map((value, index) => {
                        if (index === 0) {
                            return (<CategorySkill key={Math.random()} id={index} value={value}
                                                   options={this.state.categoryOptions}
                                                   handleChanges={this.handleChanges}
                                                   removeCategory={this.removeCategory}
                                                   addSkill={this.addSkill} removeSkill={this.removeSkill}
                                                   handleSkillChanges={this.handleSkillChanges}
                                                   handleCategoryIndexChangeUpward={this.handleCategoryIndexChangeUpward}
                                                   handleCategoryIndexChangeDownward={this.handleCategoryIndexChangeDownward}
                                                   handleSkillIndexChangeUpward={this.handleSkillIndexChangeUpward}
                                                   handleSkillIndexChangeDownward={this.handleSkillIndexChangeDownward}
                                                   indexDownward={true}
                            />)
                        }
                        else if (index > 0 && index === this.state.data.length - 1) {
                            return (<CategorySkill key={Math.random()} id={index} value={value}
                                                   options={this.state.categoryOptions}
                                                   handleChanges={this.handleChanges}
                                                   removeCategory={this.removeCategory}
                                                   addSkill={this.addSkill} removeSkill={this.removeSkill}
                                                   handleSkillChanges={this.handleSkillChanges}
                                                   handleCategoryIndexChangeUpward={this.handleCategoryIndexChangeUpward}
                                                   handleCategoryIndexChangeDownward={this.handleCategoryIndexChangeDownward}
                                                   handleSkillIndexChangeUpward={this.handleSkillIndexChangeUpward}
                                                   handleSkillIndexChangeDownward={this.handleSkillIndexChangeDownward}
                                                   indexUpward={true}
                            />)
                        }
                        else if (index > 0) {
                            return (<CategorySkill key={Math.random()} id={index} value={value}
                                                   options={this.state.categoryOptions}
                                                   handleChanges={this.handleChanges}
                                                   removeCategory={this.removeCategory}
                                                   addSkill={this.addSkill} removeSkill={this.removeSkill}
                                                   handleSkillChanges={this.handleSkillChanges}
                                                   handleCategoryIndexChangeUpward={this.handleCategoryIndexChangeUpward}
                                                   handleCategoryIndexChangeDownward={this.handleCategoryIndexChangeDownward}
                                                   handleSkillIndexChangeUpward={this.handleSkillIndexChangeUpward}
                                                   handleSkillIndexChangeDownward={this.handleSkillIndexChangeDownward}
                                                   bothIndex={true}
                            />)
                        }
                    })
                }
                <div className='bottom-margin'>
                    <button type="submit" className="btn btn-primary btn-primary" onClick={this.insertData}>Save
                    </button>
                    <p className="red">{this.state.message}</p>
                </div>
            </div>
        );
    }
}

export default Category;