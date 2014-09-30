jQuery(document).ready( function() {
	var socket = io.connect(window.location.protocol + "//" + window.location.host);

	jQuery('.login a').click(function() {
		jQuery('#login-dropdown').toggle();
		console.log(jQuery('#login-dropdown').css('display'));
		if (jQuery('#login-dropdown').css('display') == 'block') {
			jQuery('input[name=email]', '#login-form').focus();
		}
	});
	
	activateListeners();
	activateSockets();
	
	function activateSockets() {
		socket.on('collaborator.new', function(data) {
			if (data.state == 'success') {
				jQuery('#newCollaboratorModal').modal('hide');
				var html = null;
				html += '<tr><td>'+data.user.username+'</td><td>'+data.user.email+'</td><td><a href="#" class="btn"><i class="icon-white icon-edit"></i></a>&nbsp;<a href="#" class="btn btn-danger removeCollaborator" data-user-id='+data.user.id+'><i class="icon-white icon-remove"></i></a></td></tr>'
				jQuery('#manageDocuments .table tbody').append(html);
				//location.reload();
			}
			else if (data.state == 'error') {
				if (data.error == 'ownerEqualsCollab') {
					error = 'You can\'t add the owner of this document as a collaborator!';
				}
				else if (data.error == 'collabNotExists') {
					error = 'No user with that emailaddress!';
				}
				else if (data.error == 'collabAlreadyPresent') {
					error = 'Collaborator already present!';
				}
				else {
					error = 'Ow nose! Something really bad happened!!!';
				}
				var html = null;
				html = '<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button><strong>Warning: </strong>'+error+'</div>';
				modal = jQuery('#newCollaboratorModal .modal-body').html();
				newContent = html;
				newContent += modal;
				jQuery('#newCollaboratorModal .modal-body').html(newContent);
				reactivateListeners();
			}
		});
		socket.on('collaborator.remove', function(data) {
			if (data.state == 'success') {
				$el[0].parentNode.parentNode.remove();
			}
			else {
				console.log(err);
			}
		});
		socket.on('document.remove', function(data) {
			window.location.replace('dashboard');
		});
		socket.on('document.new', function(data) {
			if (data.state == "success"){
				jQuery('#newDocumentModal').modal('hide');
				var html = '<li class="span4"><div class="thumbnail"><a href="#" class="thumbnail"><img width="300px" height="200px" data-src="holder.js/300x200/doctopus" alt="Thumbnail of first page [300x200]" style="width: 300px; height: 200px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADICAYAAABS39xVAAAUdElEQVR4Xu2ci5dV9XXH933NDPKShwqIiKCAiAoBpb6CGqMRW7ua1TRpV5q+kj7+o6ZNm9WslZU0fbciGnygiYoaRFAhAcUHoEEeVlBn5j679zlz7j33zL0zd6Yzmdn+Pmctlzpz7rn79/n+zvf89v7tM7kv7fxqQzggAAEIOCCQw7AcqESIEIBARADDYiJAAAJuCGBYbqQiUAhAAMNiDkAAAm4IYFhupCJQCEAAw2IOQAACbghgWG6kIlAIQADDYg5AAAJuCGBYbqQiUAhAAMNiDkAAAm4IYFhupCJQCEAAw2IOQAACbghgWG6kIlAIQADDYg5AAAJuCGBYbqQiUAhAAMNiDkAAAm4IYFhupCJQCEAAw2IOQAACbghgWG6kIlAIQADDYg5AAAJuCGBYbqQiUAhAAMNiDkAAAm4IYFhupCJQCEAAw2IOQAACbghgWG6kIlAIQADDYg5AAAJuCGBYbqQiUAhAAMNiDkAAAm4IYFhupCJQCEAAw2IOQAACbghgWG6kIlAIQADDYg5AAAJuCGBYbqQiUAhAAMNiDkAAAm4IYFhupCJQCEAAw2IOQAACbghgWG6kIlAIQADDYg5AAAJuCGBYbqQiUAhAAMNiDkAAAm4IYFhupCJQCEAAw2IOQAACbghgWG6kIlAIQADDYg5AAAJuCGBYbqQiUAhAAMNiDkAAAm4IYFhupCJQCEAAw2IOQAACbghgWG6kIlAIQADDYg5AAAJuCGBYbqQiUAhAAMNiDkAAAm4IYFhupCJQCEAAw2IOQAACbghgWG6kIlAIQADDYg5AAAJuCGBYbqQiUAhAAMNiDkAAAm4IYFhupCJQCEAAw2IOQAACbghgWG6kIlAIQADDYg5AAAJuCGBYbqQiUAhAAMNiDkAAAm4IYFhupCJQCEAAw2IOQAACbghgWG6kIlAIQADDYg5AAAJuCGBYbqQiUAhAAMNiDkAAAm4IYFhupCJQCEAAw2IOQAACbghgWG6kIlAIQADDYg5AAAJuCGBYbqQiUAhAAMNiDkAAAm4IYFhupCJQCEAAw2IOQAACbghgWG6kIlAIQADDYg5AAAJuCGBYbqQiUAhAAMNiDkAAAm4IYFhupCJQCEAAw2IOQAACbghgWG6kIlAIQADDYg5AAAJuCGBYbqQiUAhAAMNiDkAAAm4IYFhupCJQCEAAw2IOQAACbghgWG6kIlAIQMCdYV2yoC7FYm/CDQ3mpKz/DMyrS6EgUq+JDH6S0w/bP7PrmLswjrGmMX76cX5Gg1t0hcbS11BgIufeL0hD/zPN/cL5qWe4ZEVN5sxvSK0qcvqdgmrVXaPsuQuXNkbFO6MA+fJpI+DMsBry4F8M6c3TG4/338rLC//d1/xMvd6Qx78/IJ9dmFlDyEZfUnP47b8elHwhJxbjY9+fI4MXZspUW4wb6lSP/aPxyk0bw3yhIXd/Y1gWXa6uqEfrO0dr1PncftnxtXI0J8b6bG8zZvRZ8xbVZclydW49PjxZmEFdJjuCz9fn3BnW/X8yLPMXx5N7vOPkr/Ly4qN9ct83h2XhZY1ZYAadIzbDeuivBqVQnB2GlTBuGXxu2hiu3VyVzfdUmmDGMp3O5/bLnb9XiebEdDyQNt9TlrWbddmrx/49RXnn9dJ4047fTyMBd4a19f54ckZ5ih5LVrTMyyb7GX0KFvSpndf06sSvCnJsf7HtZtv9DwMy9MnsW2GlDWtmY2zIxt+qiqWodU2dX3u2pGm1TJthbbqrLOu3xYbw8ZmcHHiqJOc/iNPQ7NH53Lxcvz0b79StTjfeXtbrx/Hte6RPTh3TicUxYwScGdZoTvd9cyhaPdnxzuGC7H+8L3NSo+1me3l3v1y7pRJ9xuolH5/JyytPlJp1I0s7tt5Xlrw9SDUT2L+nT6qV+AZYua4mV2+sRjfTyaMFee9IUXL6qy1fKkupXzR1Ejn1ZkG23FuJ6jH2+bdfL8obz5dklX5u/baq9F/SiAzgly+Vos/bkV1hvaLfec2NVZm3KB7X6bfzURz1enIjNmTTnXqTXlqX8lBO3tNx33B7RS69oqEW05CzWnc69ExRLp5vv7mWXVONP7cwHntNFzan3yvI0V8U5ZOPEhNvRAZg8ef0RwefLun4J2ZYxVJDttxXUV5VyefjmId1zEf2leStV0cKkLmGbFAea3SFNWdeLJmdc1x//+6RQnsdb8xz87JqQ70t3lo1J1sfKEtff0Ovk4u+c9tXKrJ4WU1e3GWmU5Qrr6vKxtuMsRqz1suS2tkbzxfjkoF+5/pbqnLNplrEy46zJ3NyTs30yItFZdduism8KQ2Ics/JiV8WZfO95aaGJ/XhefCZkjSaGsZj7k2T+NwFS+ty61fKqvtIre/dghw/WJDrlKNh/uB4Qd5+rVXgtfM3312RRcvilNbm3cmjRTm8b3T8mZtm1v6vc8NSM/pjTfe06GqHTQpLAduPlmF1U6Fea8ju7+nK67O89M2py0PfGWrWk9I1r3R6ENfH+vV8Tee+E9efJnokKUZiWLYqzJkDdjgqZZFHv9cv1WEzloaMlxpna2FmqmtuilcK2cPOffYnA3oztl97MimhGYCl4IUuGyNnTuTkZ/82IKWB7tyyqddYjPfvKci6rfW2lNAeMN00eWl3SRYsqcuGW7uz2PODgehB0Oka3dLO9LzpNg/aNYwfdL1pInLF6pqmvjoJxjhO6Zzcp3PSDntA3vJAK9VOfyyK4+8Gmg/iic7bmTzfv2GN1KcmYli2YrBVUinlbUdesCdPadRqJ10Av1HTl3Uj6UtijunVUSJkraq7VlqPyh72vcVUCeTiRznZ808D+rNWDSv5jKW3FmOyQmkf32gTLg+p2anfpMd0/FBeDjxpplqXnd9umYjF8enFnCxM1QJbk719RRqPv7cVlnntA3821FyRWMwXPxIZmNse1+vPFaNUPV1sT8Y9/KnIC5p62e5kcmSL7e3nlnRFW22rUVaVRZJiZzU4uDevq0zdBVVDNcZntYQwpCuPK6+tNVlb7fNlXanb6n3+4tYVjHFlWOTpH/fLsD7c0keneWDXzz6A4rrqxDQxrrYp06ert9Yck1EPhWRO2q74g38eP3TtMJMd1DLI3AWtPPv0u3n5+b/H5ubpCM6wbMK8pGmh2oHco7tTi5clq7N4Io1VAO/FsF77eVGOvhyngOknXPLzDdsrmr5pPqbHkN6cj+rKzto00jfY+V/nZO8/90fp5pe/NSTzLo2nlK0Ed313jpT1pkk2Euzn5z+w8+PZfPc3hlJjilec1gZw99fjp7OlKz/9gU7URk7SNaHW6nTyhpX+HvuuXzyu6d1hdWhNr+7S1cHlV4+kJhr/rr8diFLcdAydU/rW7dT53NHxZg3Lbtg3nivJuV/rClrTxNsfjlcettLY+6N+uXA+L5etrMltv1tWE2jIh5omP/cf9jTLSVrzfY+UonSy05E1rP/9MCdP6bWtVeWLX9NdUE3XEw3/57sDsnCJ7o72qInF9kXdCU2Og3tL8uaBYhTznV8dbhpTomG67mZlCssSjPXytdXm2FtzaeKZwUwaXFCGZU+8Z37S33x6p4XttGLKplXjGZadv/vv49QyrxP/4b9p7fzt0iV4eTDfZh5mWLv0/JLe0+mi+xOaklwcqSlZ/9MDf5pNUdt37dLndxqTTTBbxS1dWZfLV9U0HRNZrL1WC/SmSY6pMKwb7qhoqhWbsd2wT/7QnuDxDRGNQ1dftmJMp1WdmHa7ITqfO75hvfRoSTdgYqOxHrN7/0gdM3VYPGdPFeSMrjre0hpQRdPB5Eh/p6WTVpsaz7DsemlNLE22B0927L1qko7B6mjP/EtrqbVF661rbozT20TDdOnCjMnqWgX136LWZ1eujx8aM98+MznbC8qwIkNJ7RL2YkATSQnTkyD9xLWn3G7tZ7JVTfpp2cmwLCXapauupDjbecXXPUXrdlPf9nBZVqyNJ2unYyoMK/3d2dVSt5XrdBtWVnNb7aVX1lkWdv7z/9UfNa/aMRnDSlbO42nYqyZjcb1idTVq62galprq/d8av/XHHt5P/2hAPjo9u3bMx7Ox4AyrNwMaiuoDk1lhJddP36CJMfViWOlVmolnBeed327FE28CdO+L6mQA2f4lSws/OG47YaIF6/ansxX0R/et9VbD6rQpkUzAdB3tN7nC6raSWLm+Ktd9odpMn9M3iqXcSco6GcOyVPMRS3lHuvU7jX35Gt3BS/WfjaXJWFxHr6hLcoem38tWxw+nwU90d/P9vEqtYqtJVcq2j6zzSldcx14tyPlUrXA8s5gNv8ewxiii22R/8ocDcuGsCq56P6i7h3Pmtu9Idls5TNawbFKkUw9ro9g2stvTMrOJGdZNOyrRzZlOG+y/199akU13ZH8+ecOyto/tD8W1lvTOq/3/um0VXa3E32W/s9qdFa5/Eyus9ENq1fXaXqLtClY8txaUY/tLalp1Wa1tJNbCEMWXeiOivYbVvQ8rW8NKp6GrN1Vl65fjVVDCZd0ttZ41yc4BK5afOVGINlNst7h/TmwlySr5xrsqyjtm/c4b2urz03h3yebw2i36c+u40aEef01Xkbrq93RgWBnDilYYqVYJe1oe1t6cNTfXZP5IX1R6ckyHYdn1j71iKUmuOantZ2dO5OXZf7W6UCdTiSdeJwNIG5YV9Pft6pfl2pN1s/boJLuQrRRu8oaVvWmr5YYcerZP207qzW5xizFpCekWb7cbaDI1rOwKK70isd9ZY6z1L1nbgO02JqYSb260F91tc+Oo7m6+/2ZxVGNrduyWciU9UenWBeP/tBbjb9oRr/DsGE+TbFtH0iC9VDdT0u00iWGZKd+ifWfJYT8/cTQfbfYkdUszTiv+x20yfg7/hjWBPqxsD023p/ttvzMsK67tXu9JG1a3VCeewHEq11tKGJ/b7bDY9/44qTm0m0q6V6yXlLDTd1iX+RNWJNenbzol7JSCjvU+5trNFU114hux09FLmv3/MSyLzdo2kjaOrObpFLvb91i6bHWsrKFGZtblfdRObQ3Z66c3fbJp+tia5GTD9rIaTufesbQxxX2IWqf7w9YOeKdrH9Y2Hmvk9Xa4Nyzr5VmyPE7T3jyg3cR7x+50Txfd05PAlscHnmgtnXf8wVDbaz9WY/hUa0dJbSD5rqiH6i8Hpdinu1+pBtRuRff0LlVSjLddwp3afGrXsG7vc1pzSBfI40JwnxaCE0drN6xuY2qlAw3ZvrPc3CFKbry3DxWjjvrkpevu9TFp3gC97C5dvbEiX9BO92wzrTF87j/72rrY2zQ4pBo8mdWvdUt1Pnf0irCiDDtpklxp0eV1bWEYbnbYp2/aU8fi90+Tgvkc7V265+taChjpxu/VsKzDPumQT3hnNexdk3gVtOLa+L3LJJZzuuKra1f/ZVfFD9e2xmndXNiinfZrbmp/8Fr8rz7V19YR78m0nBvW9KK21dOA1gdm4k++DMytS7/WyyzR+/hM53frJjp6ay24RF8zqWsnuO0OdXpfb6LX7Ha+NXsuvVL/FNDIQ/yzi9bqMLvew5uv7QaX6DuTkaHojW+vaVka2OmwZsy4iG6vVo3+8zrZ0oC1seS0hSN6JzN6Bayzhr1oUuyry6rr7TWsuD3FWjSSV4O23l+W1TdkN05aIyjo+WbQ9u+axn/2pJqfs7pVWg8Ma6ruUK4TNIGsYU3lnzFaelVNdvx+q3HUXm9662BJrtKdziuva62gxmps/byIg2F9XpRkHDNKoFstcyqC6vTKU/a6Vl54TOt32Zerp+L7Z9M1MKzZpAaxuCVgK6ykDplu25iqAVmKfbPWr1Zrm0u6NmjvrZ7SvxzS/tc8pupbZ991MKzZpwkRQWBMAn0DmgbqsquhpStrBA3pwLBCUpuxQsA5AQzLuYCED4GQCGBYIanNWCHgnACG5VxAwodASAQwrJDUZqwQcE4Aw3IuIOFDICQCGFZIajNWCDgngGE5F5DwIRASAQwrJLUZKwScE8CwnAtI+BAIiQCGFZLajBUCzglgWM4FJHwIhEQAwwpJbcYKAecEMCznAhI+BEIigGGFpDZjhYBzAhiWcwEJHwIhEcCwQlKbsULAOQEMy7mAhA+BkAhgWCGpzVgh4JwAhuVcQMKHQEgEMKyQ1GasEHBOAMNyLiDhQyAkAhhWSGozVgg4J4BhOReQ8CEQEgEMKyS1GSsEnBPAsJwLSPgQCIkAhhWS2owVAs4JYFjOBSR8CIREAMMKSW3GCgHnBDAs5wISPgRCIoBhhaQ2Y4WAcwIYlnMBCR8CIRHAsEJSm7FCwDkBDMu5gIQPgZAIYFghqc1YIeCcAIblXEDCh0BIBDCskNRmrBBwTgDDci4g4UMgJAIYVkhqM1YIOCeAYTkXkPAhEBIBDCsktRkrBJwTwLCcC0j4EAiJAIYVktqMFQLOCWBYzgUkfAiERADDCkltxgoB5wQwLOcCEj4EQiKAYYWkNmOFgHMCGJZzAQkfAiERwLBCUpuxQsA5AQzLuYCED4GQCGBYIanNWCHgnACG5VxAwodASAQwrJDUZqwQcE4Aw3IuIOFDICQCGFZIajNWCDgngGE5F5DwIRASAQwrJLUZKwScE8CwnAtI+BAIiQCGFZLajBUCzglgWM4FJHwIhEQAwwpJbcYKAecEMCznAhI+BEIigGGFpDZjhYBzAhiWcwEJHwIhEcCwQlKbsULAOQEMy7mAhA+BkAhgWCGpzVgh4JwAhuVcQMKHQEgEMKyQ1GasEHBOAMNyLiDhQyAkAhhWSGozVgg4J4BhOReQ8CEQEgEMKyS1GSsEnBPAsJwLSPgQCIkAhhWS2owVAs4JYFjOBSR8CIREAMMKSW3GCgHnBDAs5wISPgRCIoBhhaQ2Y4WAcwIYlnMBCR8CIRHAsEJSm7FCwDkBDMu5gIQPgZAIYFghqc1YIeCcAIblXEDCh0BIBDCskNRmrBBwTgDDci4g4UMgJAIYVkhqM1YIOCeAYTkXkPAhEBKB/wN0hYXtLiAvngAAAABJRU5ErkJggg=="></a><div class="caption"><h3>'+data.document.title+'</h3><p>'+data.document.description+'</p><p class="muted">Last modified: ' + moment(data.document.updated_at).fromNow() + '</p><p><a href="/document/manage/'+data.document._id+'" class="btn btn-success">Manage</a>&nbsp;<a href="/document/edit/'+data.document._id+'" class="btn">Edit</a></p></div></div></li>';
				jQuery('ul.documentList').append(html);
			}
			else {
				alert('data is ' + data);
			}
		});
	}
	
	function activateListeners() {
		
		jQuery('#removeDocumentButton').on('click', function() {
			$('#removeDocumentModal').modal('show');
		});
		
		jQuery('#removeDocumentModal .modal-footer .btn-danger').on('click', function() {
				documentUrl					= window.location.pathname.split('/'),
				documentId 	= documentUrl[3];
			
			socket.emit('document.remove', documentId);
			reactivateListeners();
		});
		
		jQuery('.removeCollaborator').on('click', function() {
			$el = jQuery(this);
			params = {};
			documentUrl = window.location.pathname.split('/');
			params.documentId = documentUrl[3];
			params.userId = jQuery(this).attr('data-user-id');
			socket.emit('collaborator.remove', params);
			reactivateListeners();
		});
		
		jQuery('#newCollaboratorButton').on('click', function() {
			$('#newCollaboratorModal').modal('show');
			$('#newCollaboratorModal .modal-body input[name="collaboratorEmail"]').focus();
		});
		
		jQuery('#newCollaboratorModal .modal-footer .btn-success').on('click', function() {
			var newCollaborator		= {};
			documentUrl = window.location.pathname.split('/');
			newCollaborator.documentId = documentUrl[3];
			newCollaborator.email	= jQuery('#newCollaboratorModal .modal-body input[name="collaboratorEmail"]').val();
			newCollaborator.rights	= jQuery('#newCollaboratorModal .modal-body select[name="collaboratorRights"]').val();
			socket.emit('collaborator.new', newCollaborator);
			reactivateListeners();
		});
		
		jQuery('#newDocumentButton').on('click', function() {
			$('#newDocumentModal').modal('show');
		});
		jQuery('#newDocumentModal .modal-footer .btn-success').on('click', function() {
			var newDocument 		= {};
			newDocument.title 		= jQuery('#newDocumentModal .modal-body input[name="documentTitle"]').val();
			newDocument.description	= jQuery('#newDocumentModal .modal-body input[name="documentDescription"]').val();
			newDocument.visibility	= jQuery('#newDocumentModal .modal-body select').val();
			newDocument.username	= jQuery('#newDocumentModal .modal-body input[name="username"]').val();
			
			socket.emit('document.new', newDocument);
			
			reactivateListeners();
		});
	}
	
	function reactivateListeners() {
		jQuery('#newDocumentButton').off('click');
		
		jQuery('#removeDocumentButton').off('click');
		
		jQuery('#removeDocumentModal .modal-footer .btn-danger').off('click');
		
		jQuery('#newCollaboratorButton').off('click');
		
		jQuery('#newCollaboratorModal .modal-footer .btn-success').off('click');
		
		jQuery('#newDocumentButton').off('click');
		
		jQuery('#newDocumentModal .modal-footer .btn-success').off('click');
		
		activateListeners();
	}
});