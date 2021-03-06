import { Component } from 'react'
import API_ROOT from '../../apiRoot'
import { Link } from 'react-router-dom';
import Hero from '../Hero/Hero'
import Monster from '../Monster/Monster'
import Victory from '../Victory/Victory';
import enemyAttackImg from '../../Images/images/lightning01.gif';
import playerAttackImg from '../../Images/images/shadow-spear-effect.gif';
import '../../index.css'
import battleMusic from '../../audio/battletheme.mp3'
import Loading from '../../Container/Loading/Loading'




class Battlesystem extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            hero: {},
            monster: {},
            isControlsVisible: true,
            isBattleSceneVisible: false,
            isVictoryVisible: false,
            isGameoverVisible: false,
            enemyAtk: false,
            playerAtk: false,
            isLoadScreenVisible: true
            
        }
    }
    
    componentDidMount() {
      

        fetch(`${API_ROOT}/heros`)
        .then(res => res.json())
        .then((response) => {
          
          this.setState({hero: response[0]})
          
          }
          
        )
    
    
        fetch(`${API_ROOT}/monsters`)
        .then(res => res.json())
        .then((response) => {
          this.setState({monster: response[0]})
 
        })

           this.setState({
             isLoadScreenVisible: false ,   isBattleSceneVisible: true,

           })
          //  console.log("componentDidMount")
      }

    
    playerDamageCalc(){
      
      setTimeout(()=>{
        this.setState({playerAtk: true}, ()=>{
          let currentDamage = this.state.monster.hp - this.state.hero.atk 
      
          if(currentDamage <= 0){  
       
            currentDamage = 0
          
          this.setState({monster:{...this.state.monster, hp:currentDamage}}) 
        
          setTimeout(()=>{
           this.setState({isVictoryVisible:true, isBattleSceneVisible:false})
      
          },2000)
  
        }else {
          setTimeout(()=>{
            this.setState({playerAtk: false})
          },2000)
          this.setState({monster:{...this.state.monster, hp:currentDamage}}) 
          this.enemyAttack() 
        }
        
      })

     },2000)   

    }
    


   handleAttk = (e) => {
    e.preventDefault()
    this.playerDamageCalc(this.state.hero.spell)
     
   }


   handleSpell = (e) =>{
    e.preventDefault()
    this.playerDamageCalc()
  
   }




   enemyAttack(){
    
    this.setState({isControlsVisible: false})
  
    setTimeout(()=>{
       this.setState({enemyAtk: true})
        let currentDamage = this.state.hero.hp - this.state.monster.atk
       
        if(currentDamage <= 0){
          currentDamage = 0
          
          this.setState({hero:{...this.state.hero, hp:currentDamage}})

          setTimeout(()=>{
            this.setState({isGameoverVisible:true})
            this.setState({isBattleSceneVisible:false})
          },2000)
          
        } 
         else {
          this.setState({hero:{...this.state.hero, hp:currentDamage}})
    
          setTimeout(()=>{
              this.setState({enemyAtk: false})
              this.setState({isControlsVisible: true}) 
          },1000)
        }
      
    },2000)  
  }





render(){


  const BattleScene = (
    <div className="battle-scene">   

               {this.state.enemyAtk ? <img className="light-img" src={enemyAttackImg} alt="lightening"/>: null}

               {this.state.playerAtk ? <img className="atk-img" src={playerAttackImg} alt="player" /> : null }
             
               <Monster monster={this.state.monster}/>
             
               <br></br><br></br>



               <div className="controller"> 
                  {this.state.isControlsVisible ? <button className="btn-atk btn btn-danger" onClick={this.handleAttk}>Attack</button> : null} 
                  {this.state.isControlsVisible ? <button className="btn-spell btn btn-primary" onClick={this.handleSpell}>Spell</button>: null}
                  {this.state.isControlsVisible ? <Link className="btn-run btn btn-success" to="/">Run</Link>: null}
                
                <Hero />
               
                </div>

                <br></br><br></br>

                <div className="monster-health">
                    Monster Health :{this.state.monster.hp}
                </div>

                <div className="hero-health">
                    Hero Health :{this.state.hero.hp}
                </div>

                
                <div>
                   <audio src={battleMusic}  controls autoPlay hidden/>
                </div>
               
            </div>
          
  )


        return(
          <div className="main-div">

          
          {this.state.isBattleSceneVisible ? BattleScene : null}
          <br/>
          {this.state.isVictoryVisible ? <Victory />:null }
          <br/>
          {this.state.isGameoverVisible ? 'game over' : null }
          <br/>
          {this.state.isLoadScreenVisible ? <Loading />: null }



          </div>
            
      )
          
 
    }

}

export default Battlesystem;