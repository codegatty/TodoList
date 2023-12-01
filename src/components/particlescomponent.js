import Particles from "react-tsparticles"
import particlesConfig from "./config/particlesconfig"
const ParticlesBackground = () => {
    return(
        <Particles params={particlesConfig}></Particles>
    )
}
export default ParticlesBackground