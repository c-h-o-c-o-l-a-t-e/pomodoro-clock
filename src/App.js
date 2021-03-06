import React,{Component} from 'react';
import './App.css';
import BreakLabel from './Components/BreakLabel';
import SessionLabel from './Components/SessionLabel';
import TimerLabel from './Components/TimerLabel';
import {Button,Paper} from '@material-ui/core';
const audio=document.getElementById('beep');
class App extends Component{
  constructor(props){
    super (props);
    this.countdown=undefined;
    this.state={
      breakLength:5,
      sessionLength:25,
      timeLeft:25*60,
      timerIndicator:'POMODORO',
      running:false
    }
    this.handleDecrement=this.handleDecrement.bind(this);
    this.handleIncrement=this.handleIncrement.bind(this);
    this.reset=this.reset.bind(this);
    this.handleStartStop=this.handleStartStop.bind(this);
    this.convertToTime=this.convertToTime.bind(this);
  }
  componentWillMount(){
    clearInterval(this.countdown);
  }
  reset(){
    this.setState({
      breakLength:5,
      sessionLength:25,
      timeLeft:25*60,
      timerIndicator:'POMODORO',
      running:false
    })
    clearInterval(this.countdown);

    audio.pause()
    audio.currentTime=0;
  }
  handleDecrement(e){
    const {id}=e.target;
    if(id==='break-decrement' && this.state.breakLength>1){
      this.setState({
        breakLength:this.state.breakLength-1,
      })
    }
    else if (id==='session-decrement' && this.state.sessionLength>1){
      this.setState({
        sessionLength:this.state.sessionLength-1,
        timeLeft:(this.state.sessionLength-1)*60
      })
    }
  }
  handleIncrement(e){
    const {id}=e.target;
    if(id==='break-increment' && this.state.breakLength<60){
      this.setState({
        breakLength:this.state.breakLength+1,
      })
    }
    else if (id==='session-increment' && this.state.sessionLength<60){
      this.setState({
        sessionLength:this.state.sessionLength+1,
        timeLeft:(this.state.sessionLength+1)*60
      })
    }
  }
  handleStartStop(){
    const {running}=this.state;
    if(running){
      clearInterval(this.countdown);
      this.setState({
        running:false
      })
    }else {
      this.setState({
        running:true
      })
      this.countdown=setInterval(()=>{
        const{
          breakLength,
          sessionLength,
          timeLeft,
          timerIndicator
        }=this.state;
        if(timeLeft===0){
          this.setState({
            timerIndicator:(timerIndicator==='POMODORO')?'BREAK TIME':'POMODORO',
            timeLeft:(timerIndicator==='POMODORO')?breakLength*60:sessionLength*60
          })
          audio.play()
        }else{
          this.setState({
            timeLeft:timeLeft-1
          })
        }
      },1000)
    }
  }
  convertToTime(count){
    let min=Math.floor(count/60);
    let sec=count%60;

    min=(min<10)?('0'+min):min;
    sec=(sec<10)?('0'+sec):sec;

    return(`${min}:${sec}`);
  }
  render(){
    return(
      <Paper elevation={3} className='container'>
        <BreakLabel increment={this.handleIncrement} breakLength={this.state.breakLength} decrement={this.handleDecrement} />
        <div className='interface'>
          <TimerLabel indicator={this.state.timerIndicator} time={this.convertToTime(this.state.timeLeft)} />
          <div className='btn-grp'>
            <Button variant='contained' color='primary' id='start_stop' onClick={this.handleStartStop}>start/stop</Button>
            <Button variant='contained' color='secondary' id='reset' onClick={this.reset}>Reset</Button>
          </div>
        </div>
        <SessionLabel increment={this.handleIncrement} sessionLength={this.state.sessionLength} decrement={this.handleDecrement} />
      </Paper>
    )
  }  
}
export default App;
