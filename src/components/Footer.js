import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const Footer = (props) => {
	const theme = useTheme();
	const mobile = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<footer className={props.className}>
			{ !mobile ? 
				<div>
					<a href="https://allmylinks.com/link/out?id=1q056q9-ywkw-7u6fhb" target="_blank"><img src="/img/footer/Telegram_Logo.png" alt="tele" className="img-fluid" /></a>
					<a href="https://allmylinks.com/link/out?id=125onsu-ywl4-u2tsjw" target="_blank"><img src="/img/footer/Medium_Logo.png" alt="tele" className="img-fluid" /></a>
					<a href="https://allmylinks.com/link/out?id=157zdrb-ywjq-1y11z4e" target="_blank"><img src="/img/footer/Youtube_Logo.png" alt="tele" className="img-fluid" /></a>
					<a href="https://allmylinks.com/link/out?id=h6szmt-zbm4-14p7uy1" target="_blank"><img src="/img/footer/TikTok_Logo.png" alt="tele" className="img-fluid" /></a>
					<a href="https://allmylinks.com/link/out?id=j55z8u-ywjp-1q1r8xe" target="_blank"><img src="/img/footer/Facebook_Logo.png" alt="tele" className="img-fluid" /></a>
					<a href="https://allmylinks.com/link/out?id=1i764v1-ztut-18namy3" target="_blank"><img src="/img/footer/Discord_Logo.png" alt="tele" className="img-fluid" /></a>
					<a href="https://allmylinks.com/link/out?id=29vjdw-ywjo-13uzlml" target="_blank"><img src="/img/footer/Twitter_Logo.png" alt="tele" className="img-fluid" /></a>
					<a href="https://allmylinks.com/link/out?id=1cawq0l-ywjr-wscszl" target="_blank"><img src="/img/footer/Instagram_Logo.png" alt="tele" className="img-fluid" /></a>
				</div>
				:
				<React.Fragment>
					<div>
						<a href="https://allmylinks.com/link/out?id=1q056q9-ywkw-7u6fhb" target="_blank"><img src="/img/footer/Telegram_Logo.png" alt="tele" className="img-fluid" /></a>
						<a href="https://allmylinks.com/link/out?id=125onsu-ywl4-u2tsjw" target="_blank"><img src="/img/footer/Medium_Logo.png" alt="tele" className="img-fluid" /></a>
						<a href="https://allmylinks.com/link/out?id=157zdrb-ywjq-1y11z4e" target="_blank"><img src="/img/footer/Youtube_Logo.png" alt="tele" className="img-fluid" /></a>
						<a href="https://allmylinks.com/link/out?id=h6szmt-zbm4-14p7uy1" target="_blank"><img src="/img/footer/TikTok_Logo.png" alt="tele" className="img-fluid" /></a>
					</div>
					<div>
						<a href="https://allmylinks.com/link/out?id=j55z8u-ywjp-1q1r8xe" target="_blank"><img src="/img/footer/Facebook_Logo.png" alt="tele" className="img-fluid" /></a>
						<a href="https://allmylinks.com/link/out?id=1i764v1-ztut-18namy3" target="_blank"><img src="/img/footer/Discord_Logo.png" alt="tele" className="img-fluid" /></a>
						<a href="https://allmylinks.com/link/out?id=29vjdw-ywjo-13uzlml" target="_blank"><img src="/img/footer/Twitter_Logo.png" alt="tele" className="img-fluid" /></a>
						<a href="https://allmylinks.com/link/out?id=1cawq0l-ywjr-wscszl" target="_blank"><img src="/img/footer/Instagram_Logo.png" alt="tele" className="img-fluid" /></a>
					</div>
				</React.Fragment>
			}
				
		</footer>
	)
}

export default Footer;